# ASO - Artificial Intelligence Sustainable Development Goal Optimizer
IBM x UNSA Hackathon 2026 PROJECT ENTRY

ASO
* Ideate alongside an agent to align startup ideas with the United Nations Sustainable Development Goals
* Receive feedback scoring your idea against the UN SDGs
* Additional feedback to determine market fit, plans for execution, and likely return on investment

## Mission Statement:
In alignment with the United Nations' 2030 Agenda for Sustainable Development, 
ASO intends to provide guidance to all that wish to make a difference. As access to tools
for development becomes more widespread, it is important to assess and aim to produce a net good. 
By assisting founders and developers in all facets of the planning process, ASO promotes the goal to bring,
as stated by the United Nations, "peace and prosperity for the people and the planet, now and into the future."

## Architecture
```
                  +---------------------------------+
                  |             Browser             |
                  |    - Speech Recognition         |
                  |  - Confirm Speech/Send Query    |
                  +---------------------------------+
                                   |
                                   |
                             HTTPS | Flask (WSGI)
                                   v
+----------------------------------------------------------------------+
|              Web Application with Flask powered backend              |
|   Routes: /get_response, /evaluate_by_sdg, /evaluate_by_investment   |
|                                                                      |
|                Querying Engine (featherless.ai)                      |
|              - uses 3 system content instructions                    |
|           - general instruction guides conversation                  |
|       - sdg evaluation uses transcript and evaluates by goals        |
|   - investment evaluation uses transcript and evaluates overall      |
+----------------------------------------------------------------------+
                                   |
                                   v
                  +--------------------------------------+
                  |             Browser                  |
                  |  - Outputs Conversation Transcript   |
                  |  - Outputs Evaluation Response       |
                  |  - Redirects Back to Session         |
                  +--------------------------------------+

```

## Featherless.ai
Featherless is a a serverless LLM Host. 
### Setup
```
client = OpenAI(
    base_url = "https://api.featherless.ai/v1",
    api_key = FEATHERLESS_SECRET_KEY,
)

response = client.chat.completions.create(
       model = "ibm-granite/granite-7b-instruct",
       max_tokens = TOKEN_COUNT,
       messages=[
           {"role": "system", "content": INSTRUCTIONS},
           {"role": "user", "content": USER_INPUT}
       ],
    )
```
The above code snippet is used for each of the AI calls to set up the system content instructions.
<br>These can be changed to meet the needs of the system more or less specifically.
<br>The above snipped specifically uses the IBM Granite 7b model.

Featherless can be accessed at <a href="featherless.ai">featherless.ai</a>
<br>For use information, Featherless docs can be accesses here: <a href="https://featherless.ai/docs/quickstart-guide">Docs</a>

## IBM Granite
For our specific purpose, we chose to develop using IBM's Granite AI model. 
<br>Granite is a customizable, open-source model.

<br>For more information about IBM Granite, visit <a href="ibm.com/granite">IBM Granite</a>

## How to Run
### Prerequisites
* Python Flask
* Python CORS
* OpenAI for Python

```
pip install Flask
pip install flask-cors
pip install openai
```

### To Run
**1. Clone the repository**
```
git clone https://github.com/deryn-hurst/ASO
cd ASO
```

**2. Configure secrets**
Create a `.env` file in the root directory and initialize with your Featherless secret key

**3. Run the server**
```
python server.py
```

**4. Run home.html in live server**
* Once running, you may begin by clicking start session and enabling microphone access
* To close session, click end stop session
* Response turnaround time for conversation is 5-10 seconds
* Response turnaround time for evaluation is ~30 seconds
* Once evaluation is complete, page will automatically redirect
* All session notes and transcripts can be downloaded after redirect
