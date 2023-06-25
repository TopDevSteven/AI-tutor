from django.shortcuts import render
from django.http import JsonResponse
from .models import Topic 
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import pinecone
import json
import openai
import os
# import win32com.client
from docx import Document
import requests
import requests
from bs4 import BeautifulSoup

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
        apiKey = "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"
        openai.api_key = apiKey
        # embedding vectors with the highest socores.
        queryResponse = query_embedding(data["text"], data["maintopic"])
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
            print(f"Error: {e}")

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
                content = parse_pdf(uploadedFile)
            elif format == "docx":
                content = parse_docx(uploadedFile)
                print(content)
            # elif format == "doc":
            #     parse_doc(uploadedFile)
            else:
                return JsonResponse({'message': 'Non-valied format'})
        except:
            try:
                data = json.loads(request.body)
                url = data["web_url"]
                # print(url)
                topic = data["topic"]
                # print(topic)
                date = data['date']
                # print(date)
                type = data['type']
                # print(type)
                content = web_parser(url)
                # print(content)
            except:
                return JsonResponse({'message': 'Non-valied url'})
        sentences = []
        chunk = ""
        # print(content)
        for i in range(0, len(content)):
            chunk += f"\n {content[i]}"
            if (i+1)%5 == 0:
                sentences.append(chunk)
                chunk = ""

        # print(sentences)
        try:
            # Creating Embedding
            sentences_list , embeddings, vec_indexs = create_embedding(sentences)
            meta =[{"sentence": line} for line in sentences_list]
            vector = list(zip(vec_indexs, embeddings, meta))
            print(vector)
            # Inserting the embedding
            embedding_to_pinecone(vector, topic)
            new_topic = Topic(name=topic, date=date, type=type)
            new_topic.save()
            return JsonResponse({'message': 'success'})
        except:
            return JsonResponse({'message': 'Embedding Error'})


#Function for Creating Embedding
def create_embedding(sentences):
    # Downloading the model for embedding.
    model = SentenceTransformer('roberta-large')

    for i in sentences:
        print(i)
    # Creating the embedding from sentences array
    embeddings = model.encode(sentences)

    # print(embeddings)
    # print(embeddings)
    vec_indexs = []
    # creating the vector indexes
    for i in range(0, len(embeddings)):
        vec_indexs.append("vec" +  str(i))

    return sentences, embeddings.tolist(), vec_indexs

#Function for inserting embedding to pinecone
def embedding_to_pinecone(vector, nameSpace):
    # Initialized pinecone client
    pinecone.init(api_key="d1df61d7-1c01-44e9-accf-4113e79faa6f",
                  environment="northamerica-northeast1-gcp")
    # Testing the indexs client
    active_indexes = pinecone.list_indexes()
    if len(active_indexes) != 0:
        index = pinecone.Index(active_indexes[0])
        try:
            # inserting the embedding
            vectors_list = chunk_list(vector, 50)
            for i in vectors_list:
                index.upsert(vectors=i, namespace=nameSpace)
            print("successfull inserted embeddings")
        except:
            print("inserting embedding error")
    else:
        print("create index")
        pinecone.create_index("example-index", dimension=1024)

# Quering the pinecone
def query_embedding(question, nameSpace):
    sentences, embeddings, vec_indexs = create_embedding([question])
    pinecone.init(api_key="d1df61d7-1c01-44e9-accf-4113e79faa6f",
                  environment="northamerica-northeast1-gcp")
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
    
def chunk_list(input_list, chunk_size):
    return [input_list[i:i + chunk_size] for i in range(0, len(input_list), chunk_size)]

def parse_pdf(uploadedFile):
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
    
    return content

def parse_docx(uploadedFile):
    doc = Document(uploadedFile)
    content = []
    for paragraph in doc.paragraphs:
        for sentence in paragraph.text.split("\n"):
            if len(sentence) > 2:
                content.append(sentence)

    return content

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
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    text = soup.get_text()
    content = []
    for sentence in text.split("\n"):
        if len(sentence.strip()) >= 3:
            content.append(sentence.strip())
    return content