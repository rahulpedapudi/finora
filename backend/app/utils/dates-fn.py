from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

# now = date.today()

# # CURRENT PERIOD
# current_from = now - relativedelta(day=1)
# current_to = now

# # PREVIOUS PERIOD
# previous_from = current_from - relativedelta(months=1)
# previous_to = current_from - relativedelta(days=1)


# print("current to_ ", current_to)
# print("current from_ ", current_from)

# print("previous to_ ", previous_to)
# print("previous from_ ", previous_from)


year = date.today().year
print(year)

from_ = date(year, 1, 1)

print(date.today().replace(day=1))
