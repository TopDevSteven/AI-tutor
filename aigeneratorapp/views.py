from django.shortcuts import render
from django.http import JsonResponse
import json
import openai

chat_history = []

# Create your views here.
def front(request):
    context = { }
    return render(request, "index.html", context)


def my_api_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        apiKey = "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"
        openai.api_key = apiKey

        systemContent = """
            You have to generate the only  code based on requirement of user.
            I mean you don't must generate additional description, you must generate the only python code.
        """
        inputContent = data["text"]
        chat_history.append({"role": "user", "content": inputContent})
        total_tokens = sum([len(m["content"].split()) for m in chat_history])
        while total_tokens > 4000: # slightly less than model's max token limit for safety
            removed_message = chat_history.pop(2)
            total_tokens -= len(removed_message["content"])

        print(chat_history)

        try:
            res = openai.ChatCompletion.create(
                model = "gpt-3.5-turbo",
                temperature = 0.1,
                messages = [
                    {"role": "system", "content" : systemContent},
                    *chat_history
                ]
            )
            result = res["choices"][0]["message"]["content"]

            if "```" in result:
                result = result.split("```")[1]
                chat_history.append({"role": "assistant", "content": result})
                print("ok")

            generatedCode = {"code" : result}
        except:
            generatedCode = {
                "code": "net error"
            }

        return JsonResponse(generatedCode)