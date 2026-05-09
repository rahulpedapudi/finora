import re
from app.schemas.transaction import ParsedTransaction, TransactionType

from decimal import Decimal

# =========================
# KEYWORDS
# =========================

INCOME_KEYWORDS = {
    "salary",
    "freelance",
    "income",
    "credited",
    "paycheck",
    "payment",
}

EXPENSE_KEYWORDS = {
    "paid",
    "spent",
    "bought",
    "for",
}


# =========================
# MAIN PARSER
# =========================

def parse_transaction_input(text: str) -> ParsedTransaction:
    """
    Parses raw transaction input.

    Example:
        "250 swiggy"
        "salary 50000"
        "1200 for rent"
    """

    normalized = text.strip().lower()

    # =========================
    # EXTRACT AMOUNT
    # =========================

    amount_match = re.search(
        r"\d+(\.\d{1,2})?",
        normalized
    )

    if not amount_match:
        raise ValueError(
            "Could not detect amount"
        )

    amount = Decimal(amount_match.group())

    # =========================
    # DETECT TYPE
    # =========================

    txn_type = TransactionType.expense

    for keyword in INCOME_KEYWORDS:
        if keyword in normalized:
            txn_type = TransactionType.income
            break

    # =========================
    # REMOVE AMOUNT
    # =========================

    remaining = re.sub(
        r"\d+(\.\d{1,2})?",
        "",
        normalized
    ).strip()

    # =========================
    # REMOVE COMMON WORDS
    # =========================

    stop_words = {
        "for",
        "on",
        "at",
        "the",
        "a",
        "an",
    }

    words = [
        word
        for word in remaining.split()
        if word not in stop_words
    ]

    # =========================
    # DETECT MERCHANT/TITLE
    # =========================

    merchant = None
    title = None

    if words:
        merchant = words[-1]
        title = " ".join(words)

    return ParsedTransaction(
        amount=amount,
        type=txn_type,
        merchant=merchant,
        title=title
    )
