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
    response = client.chat.completions.create(
       model = "ibm-granite/granite-7b-instruct",
       max_tokens = 350,
       messages=[
           {"role": "system", "content": "You are helping a founder plan their startup based on the United Nations Sustainable Development Goals. Only speak about the idea in relation to its alginment with the United Nations Sustainable Development Goals."},
           {"role": "user", "content": input}
       ],
    )

    return response.choices[0].message.content

# use same model with different instructions to evaluate idea
@app.route('/evaluate_by_sdg', methods=["POST"])
@cross_origin()
def get_sdg_eval():
    input = request.json
    input = input.get('input')

    input = input.replace("<br>", "")
    input = input.replace("<b>", "")
    input = input.replace("</b>", "")

    response = client.chat.completions.create(
       model = "ibm-granite/granite-7b-instruct",
       max_tokens = 500,
       messages=[
           {"role": "system", "content": "You are helping a founder plan their startup based on the United Nations Sustainable Development Goals. Use the provided transcript to score the idea's alignment with each United Nations Sustainable Development Goals on a scale from 1-10. Only output each of the 17 UN sustainable development goals, its score, and a maximum 50 word explanation of why it got that score."},
           {"role": "user", "content": input}
       ],
    )

    return response.choices[0].message.content

@app.route('/evaluate_by_investment', methods=["POST"])
@cross_origin()
def get_investment_eval():
    input = request.json
    input = input.get('input')

    input = input.replace("<br>", "")
    input = input.replace("<b>", "")
    input = input.replace("</b>", "")

    response = client.chat.completions.create(
       model = "ibm-granite/granite-7b-instruct",
       max_tokens = 350,
       messages=[
           {"role": "system", "content": "You are helping a founder plan their startup. Use the provided transcript to provide information about the market fit, return on interest, and success potential for the idea."},
           {"role": "user", "content": input}
       ],
    )

    return response.choices[0].message.content

if __name__ == "__main__":
    app.run(debug=True)
