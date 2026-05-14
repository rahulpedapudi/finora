import os
from dotenv import load_dotenv
import json
from groq import Groq

from app.schemas.transaction import ParsedTransaction
import time
import logging
logger = logging.getLogger(__name__)

load_dotenv()

GROQ_API = os.getenv("GROQ_API")

client = Groq(
    api_key=GROQ_API
)

SYSTEM_PROMPT = """
You are an AI financial transaction parser.

Extract structured transaction information from natural language input.

Return ONLY valid JSON matching the schema.

Rules:
- amount must always be a number
- type must be either "expense" or "income"
- infer type intelligently from context
- merchant should be concise and normalized
- title should be short and human-readable
- category should be a from the allowed categories list

Allowed categories:
- Food
- Transport
- Entertainment
- Shopping
- Bills
- Healthcare
- Education
- Salary
- Subscription
- Other

If merchant is unknown, use empty string.

Examples:

Input:
"450 swiggy"

Output:
{
  "amount": 450,
  "type": "expense",
  "merchant": "Swiggy",
  "title": "Swiggy Order",
  "category": "Food"
}

Input:
"salary credited 50000"

Output:
{
  "amount": 50000,
  "type": "income",
  "merchant": "",
  "title": "Salary Credited",
  "category": "Salary"
}
"""


def parse_transaction(raw_input: str):

    start = time.time()

    logger.info("parsing transaction", extra={"raw_input": raw_input})

    chat_completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": raw_input,
            },
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "parsed_transaction",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "amount": {"type": "number"},
                        "type": {"type": "string", "enum": ["income", "expense"]},
                        "merchant": {"type": "string"},
                        "title": {"type": "string"},
                        "category": {"type": "string", "enum": ["Food", "Entertainment", "Transport", "Healthcare", "Shopping", "Bills", "Salary", "Education", "Subscription", "Other"]}
                    },
                    "required": ["amount", "type", "merchant", "title", "category"],
                    "additionalProperties": False
                }
            }
        },

    )
    try:
        result = json.loads(chat_completion.choices[0].message.content or "{}")
        duration = time.time() - start
        logger.info(f"parsed transaction in {duration:.2f}s")
        logger.debug(f"ai response ", result)
        return ParsedTransaction(**result)
    except Exception:
        logger.error("Error while parsing the transaction")
        return ParsedTransaction(
            amount=0,
            category="Other",
            merchant="",
            title="Unknown Transaction",
            type="expense"
        )
