# import flash for use
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

# import modules for environment variables
import os
from dotenv import load_dotenv, dotenv_values

# load env variables
load_dotenv()

# import requests for featherless access
import requests

# import open ai for featherless access
from openai import OpenAI

app = Flask(__name__)
cors = CORS(app)

# send private keys
@app.route('/get_featherless_private')
@cross_origin()
def send_keys():
    return os.getenv("FEATHERLESS_SECRET")

# connect featherless and run query
client = OpenAI(
    base_url = "https://api.featherless.ai/v1",
    api_key = os.getenv("FEATHERLESS_SECRET"),
)

@app.route('/get_response', methods=["POST"])
@cross_origin()
def get_response():
    input = request.json
    input = input.get('input')
    print(input)
    response = client.chat.completions.create(
       model = "ibm-granite/granite-7b-instruct",
       max_tokens = 350,
       messages=[
           {"role": "system", "content": "You are helping a founder plan their startup based on the United Nations Sustainable Development Goals"},
           {"role": "user", "content": input}
       ],
    )

    print(response.choices[0].message.content)
    return response.choices[0].message.content

#app.add_url_rule('/get_response/<input>', 'get_response', get_response)

if __name__ == "__main__":
    app.run(debug=True)
