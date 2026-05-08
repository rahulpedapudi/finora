import re


def parse_transaction(input_text):
    price = re.findall(r'\d+', input_text)
    return price[0] if len(price) > 0 else 0
