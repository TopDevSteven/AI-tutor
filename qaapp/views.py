from django.shortcuts import render
from django.http import JsonResponse
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import pinecone
import json
import openai

# Create your views here.

def chat_with_doc(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        apiKey = "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"
        openai.api_key = apiKey
        queryResponse = query_embedding(data)
        inputSentence = ""
        for i in queryResponse["matches"]:
            inputSentence += i["metadata"]["answer"]
        try:
            res = openai.ChatCompletion.create(
                model = "gpt-3.5-turbo",
                temperature = 0.1,
                messages = [
                    {"role": "system", "content" : ""},
                    {"role": "user", "content": inputSentence}
                ]
            )
            result = res["choices"][0]["message"]["content"]
            return JsonResponse({"message": result})
        except:
            print("GPT is not ready")

            return JsonResponse({"message": "failed"})


def upload(request):
    if request.method == 'POST':
        uploadedFile = request.FILES['files']
        try:
            pdf = PdfReader(uploadedFile)
            parsedData = {
                'num_pages': len(pdf.pages),
                'text': [page.extract_text() for page in pdf.pages]
            }
            content = []
            # Spilte whole content of pdf into each sentneces and remove the sentence with less than 2 lengths
            for pageData in parsedData['text']:
                for each_sentence in pageData.split("\n"):
                    if len(each_sentence) > 2:
                        content.append(each_sentence)
            try:
                # Creating Embedding
                sentences , embeddings, vec_indexs = create_embedding(content)
                meta =[{"sentence": line} for line in sentences]
                vector = list(zip(vec_indexs, embeddings, meta))
                print(vector)
                #Inserting the embedding
                embedding_to_pinecone(vector)
            except:
                print("Embedding error")
            
        except:
            print("Uploading failed")

        return JsonResponse({'message': 'success'})

#Function for Creating Embedding
def create_embedding(sentences):
    # Downloading the model for embedding.
    model = SentenceTransformer('roberta-large')
    # Creating the embedding from sentences array
    embeddings = model.encode(sentences)
    print(embeddings)
    vec_indexs = []
    # creating the vector indexes
    for i in range(0, len(embeddings)):
        vec_indexs.append("vec" +  str(i))

    return sentences, embeddings.tolist(), vec_indexs

#Function for inserting embedding to pinecone
def embedding_to_pinecone(vector):
    # Initialized pinecone client
    pinecone.init(api_key="24331e7c-f53c-4938-aeaf-8e107653984b",
                  environment="asia-southeast1-gcp-free")
    # Testing the indexs client
    active_indexes = pinecone.list_indexes()
    if len(active_indexes) != 0:
        index = pinecone.Index(active_indexes[0])
        try:
            # inserting the embedding
            upsert_response = index.upsert(vectors=vector, namespace="topic-1")
            print(upsert_response)
            print("successfull inserted embeddins")
        except:
            print("inserting embedding error")
    else:
        print("create index")
        pinecone.create_index("example-index", dimension=1024)

# Quering the pinecone
def query_embedding(question):
    sentences, embeddings, vec_indexs = create_embedding([question])
    pinecone.init(api_key="24331e7c-f53c-4938-aeaf-8e107653984b",
                  environment="asia-southeast1-gcp-free")
    active_indexes = pinecone.list_indexes()
    index = pinecone.Index(active_indexes[0])
    query_response = index.query(
            namespace="dental-namespance",
            top_k=30,
            include_values=True,
            include_metadata=True,
            vector=embeddings[0],
        )
    
    return query_response
    