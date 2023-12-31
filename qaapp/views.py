from django.shortcuts import render
from django.http import JsonResponse
from .models import Topic 
from PyPDF2 import PdfReader
import pinecone
import json
import openai
from docx import Document
import requests
import requests
from bs4 import BeautifulSoup
from decouple import config
import traceback

# Create your views here.

def records(request):
    if request.method == "GET":
        topics = Topic.objects.values_list('name', flat=True)
        dates = Topic.objects.values_list('date', flat=True)
        types = Topic.objects.values_list('type', flat=True)
        recordTopics = list(topics)
        recordDates = list(dates)
        recordTypes = list(types)
        return JsonResponse({"topic": recordTopics, "date": recordDates, "type": recordTypes})

def chat_with_doc(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        apiKey = config('OPENAI_KEY')
        openai.api_key = apiKey
        # embedding vectors with the highest socores.
        queryResponse = query_embedding(data["text"], data["maintopic"])
        if not queryResponse:
            return JsonResponse({"message": "Querying Embedding Error"})
        inputSentence = ""
        #Limited the tokens
        for i in queryResponse["matches"]:
            inputSentence += i["metadata"]["sentence"]

        inputSentence = limit_string_tokens(inputSentence, 4000)
        try:
            res = openai.ChatCompletion.create(
                model = "gpt-3.5-turbo",
                temperature = 0.1,
                messages = [
                    {"role": "system", "content" : "You are a helpful assistant."},
                    {"role": "user", "content": inputSentence},
                    {"role": "user", "content": data["text"]},
                ]
            )
            result = res["choices"][0]["message"]["content"]
            print(result)
            return JsonResponse({"message": result})
        except Exception as e:
            print(traceback.format_exc())
            return JsonResponse({"message": "Net Error"})


def upload(request):
    if request.method == 'POST':
        content = []
        try:
            uploadedFile = request.FILES['file']
            title = uploadedFile.name
            format = title.split(".")[-1]
            topic = request.POST['topic']
            date = request.POST['date']
            type = request.POST['type']
            if  format  == "pdf":
                content, flag = parse_pdf(uploadedFile)
                if not flag:
                    return JsonResponse({'message': 'Parsing Error or Empty PDF, Please Use other PDF'})
            elif format == "docx":
                content, flag = parse_docx(uploadedFile)
                if not flag:
                    return JsonResponse({'message': 'Parsing Error or Empty Doc, Please use other Doc'})
            # elif format == "doc":
            #     parse_doc(uploadedFile)
            else:
                return JsonResponse({'message': 'Non-valied format'})
        except:
            data = json.loads(request.body)
            url = data["web_url"]
            # print(url)
            topic = data["topic"]
            # print(topic)
            date = data['date']
            # print(date)
            type = data['type']
            # print(type)
            content , flag = web_parser(url)
            if not flag:
                return JsonResponse({'message': 'Non-valied Web url, Please use other URL'})
        sentences = []
        chunk = ""
        # sume 5 sentences as a one chunk
        for i in range(0, len(content)):
            chunk += f"\n {content[i]}"
            if (i+1)%5 == 0:
                sentences.append(chunk)
                chunk = ""

        # print(sentences)
        try:
            # Creating Embedding
            sentences_list , embeddings, vec_indexs = get_embedding(sentences)
            if len(embeddings) == 0:
                return JsonResponse({"message": "Creating Embedding Error"})
            meta =[{"sentence": line} for line in sentences_list]
            vector = list(zip(vec_indexs, embeddings, meta))
            print(vector)
            # Inserting the embedding
            isCreatingEmbedding = embedding_to_pinecone(vector, topic)
            if not isCreatingEmbedding:
                return JsonResponse({'message': "Inserting Embeeding Error"})
            new_topic = Topic(name=topic, date=date, type=type)
            new_topic.save()
            return JsonResponse({'message': 'success'})
        except:
            return JsonResponse({'message': 'Embedding Error'})

def get_embedding(content):
    try:
        apiKey = config('OPENAI_KEY')
        openai.api_key = apiKey
        # Embed a line of text
        response = openai.Embedding.create(
            model= "text-embedding-ada-002",
            input=content
        )
        embedding = []
        vec_indexs = []
        # Extract the AI output embedding as a list of floats
        # embedding = response["data"][0]["embedding"]
        index = 0
        for i in response["data"]:
            index += 1
            embedding.append(i["embedding"])
            vec_indexs.append("vec" + str(index))
        # creating the vector indexes
        return content, embedding, vec_indexs
    except Exception as e:
        print(traceback.format_exc())
        return [], [], []

#Function for inserting embedding to pinecone
def embedding_to_pinecone(vector, nameSpace):
    # Initialized pinecone client
    try:
        pinecone.init(api_key=config('PINECONE_API_KEY'),
                    environment=config('PINECONE_ENV'))
        # Testing the indexs client
        active_indexes = pinecone.list_indexes()
        if len(active_indexes) != 0:
            index = pinecone.Index(active_indexes[0])
            print(index)
            try:
                # inserting the embedding
                vectors_list = chunk_list(vector, 50)
                for i in vectors_list:
                    print(i)
                    index.upsert(vectors=i, namespace=nameSpace)
                print("Successfull inserted embeddings")
            except Exception as e:
                print("Error inserting embeddings:")
                print(traceback.format_exc())
        else:
            print("create index")
            pinecone.create_index("example-index", dimension=1536)
        return True
    except Exception as e:
        print(traceback.format_exc())
        return False

# Quering the pinecone
def query_embedding(question, nameSpace):
    sentences, embeddings, vec_indexs = get_embedding([question])
    if len(embeddings) == 0:
        return False
    try:
        pinecone.init(api_key=config('PINECONE_API_KEY'),
                    environment=config('PINECONE_ENV'))
        active_indexes = pinecone.list_indexes()
        index = pinecone.Index(active_indexes[0])
        query_response = index.query(
                namespace=nameSpace,
                top_k=50,
                include_values=True,
                include_metadata=True,
                vector=embeddings[0],
            )
        
        return query_response
    except Exception as e:
        print(traceback.format_exc())
        return False
    
def chunk_list(input_list, chunk_size):
    return [input_list[i:i + chunk_size] for i in range(0, len(input_list), chunk_size)]

def parse_pdf(uploadedFile):
    try:
        pdf = PdfReader(uploadedFile)
        parsedData = {
            'num_pages': len(pdf.pages),
            'text': [page.extract_text() for page in pdf.pages]
        }
        content = []
        for pageData in parsedData['text']:
            for each_sentence in pageData.split("\n"):
                if len(each_sentence) > 2:
                    content.append(each_sentence)
        flag =  True
        if len(content) == 0:
            flag = False
        return content, flag
    except Exception as e:
        print(traceback.format_exc())
        return [] , flag

def parse_docx(uploadedFile):
    try:
        doc = Document(uploadedFile)
        content = []
        for paragraph in doc.paragraphs:
            for sentence in paragraph.text.split("\n"):
                if len(sentence) > 2:
                    content.append(sentence)
        flag = True
        if len(content) == 0:
            flag = False
        return content, flag
    except Exception as e:
        print(traceback.format_exc())
        return [], flag

# def parse_doc(uploadedFile):
#     word_app = win32com.client.Dispatch('Word.Application')
#     doc = word_app.Documents.Open(uploadedFile)
#     text = doc.Content.Text
#     doc.Close()
#     word_app.Quit()

def limit_string_tokens(string, max_tokens):
    tokens = string.split()  # Split the string into tokens
    if len(tokens) <= max_tokens:
        return string  # Return the original string if it has fewer or equal tokens than the limit
    
    # Join the first 'max_tokens' tokens and add an ellipsis at the end
    limited_string = ' '.join(tokens[:max_tokens])
    return limited_string

def web_parser(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text()
        content = []
        for sentence in text.split("\n"):
            if len(sentence.strip()) >= 3:
                content.append(sentence.strip())
        flag = True
        if len(content) == 0:
            flag = False
        return content, flag
    except Exception as e:
        print(traceback.format_exc())
        return [], False