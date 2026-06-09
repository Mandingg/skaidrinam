# import os
# import json
# import base64
# from dotenv import load_dotenv
# from openai import OpenAI

# load_dotenv()

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", None))


# def analyze_receipt_text(ocr_text: str):
#     response = client.responses.create(
#         model="gpt-5-mini",
#         input=f"""
# Tu analizuoji lietuvišką pirkimo kvitą.

# Grąžink tik validų JSON:
# {{
#   "store_name": null,
#   "receipt_date": null,
#   "total_amount": null,
#   "category": "Kita",
#   "confidence": 0.0
# }}

# OCR tekstas:
# {ocr_text}
# """
#     )

#     return json.loads(response.output_text)


# def analyze_receipt_image(
#     file_bytes: bytes,
#     content_type: str,
#     categories: list[str]
# ):
#     base64_image = base64.b64encode(file_bytes).decode("utf-8")
#     categories_text = ", ".join(categories)

#     response = client.responses.create(
#         model="gpt-5-mini",
#         input=[
#             {
#                 "role": "user",
#                 "content": [
#                     {
#                         "type": "input_text",
#                         "text": f"""
# Tu analizuoji lietuviško pirkimo kvito nuotrauką.

# Ištrauk informaciją ir grąžink tik validų JSON:
# {{
#   "store_name": null,
#   "receipt_date": null,
#   "total_amount": null,
#   "category": "Kita",
#   "confidence": 0.0,
#   "items": [
#     {{
#       "description": null,
#       "amount": null,
#       "category": "Kita"
#     }}
#   ]
# }}

# Leistinos vartotojo kategorijos:
# {categories_text}

# SVARBU:
# - category ir item.category turi būti tik viena iš leistinų vartotojo kategorijų.
# - Jei nė viena kategorija netinka, naudok "Kita".
# - Nenaudok kategorijos, kurios nėra sąraše.

# Bendros kategorijų gairės:
# - Maistas: maisto produktai, nealkoholiniai gėrimai
# - Kuras: benzinas, dyzelinas, LPG/CNG automobiliui, degalų papildymas transportui
# - Buitis: namų prekės, higienos prekės, valymo priemonės, popieriniai rankšluosčiai, maišeliai, dujų balionai buičiai
# - Transportas: viešasis transportas, taksi, Bolt, parkavimas, automobilių plovimas
# - Sveikata: vaistinės, vaistai, medicinos prekės
# - Darbas: kanceliarija, darbo įrankiai, darbo paslaugos
# - Kita: kai neaišku

# Items taisyklės:
# - items turi būti visos pirkimo eilutės, kurios sudaro total_amount
# - neįtrauk PVM suvestinių, mokėjimo kortele eilučių, grąžos
# - jeigu kai kurių prekių nepavyksta perskaityti, pridėk:
#   {{
#     "description": "Neatpažinta prekė",
#     "amount": trūkstama_suma,
#     "category": "Kita"
#   }}
# - items sumos suma turi kuo labiau sutapti su total_amount

# Bendros taisyklės:
# - Jeigu dėl nuolaidų ar neatpažintų eilučių yra skirtumas, skirtumą pridėk prie "Kita".
# - receipt_date turi būti tik data YYYY-MM-DD, be laiko.
# - Jei didžiausia kategorija yra "Kita", bet ji sudaro mažiau nei 50% total_amount, rinkis kitą didžiausią ne "Kita" kategoriją.

# Store name taisyklės:
# - Lidl -> Lidl
# - Rimi -> Rimi
# - Maxima -> Maxima
# - IKI -> IKI
# - Norfa -> Norfa
# - Jozita -> Jozita

# Nenaudok UAB pavadinimų.
# Naudok tik vartotojui suprantamą parduotuvės vardą.
# """
#                     },
#                     {
#                         "type": "input_image",
#                         "image_url": f"data:{content_type};base64,{base64_image}"
#                     }
#                 ]
#             }
#         ]
#     )

#     result = json.loads(response.output_text)
#     return add_category_totals(result)


# def add_category_totals(ai_result: dict):
#     if ai_result.get("receipt_date"):
#         ai_result["receipt_date"] = ai_result["receipt_date"][:10]

#     ai_result["items"] = [
#         item for item in ai_result.get("items", [])
#         if float(item.get("amount") or 0) > 0
#     ]

#     totals = {}

#     items = ai_result.get("items", [])
#     total_amount = float(ai_result.get("total_amount") or 0)
#     store_name = ai_result.get("store_name") or "Nenurodyta"
#     receipt_date = ai_result.get("receipt_date")

#     for item in items:
#         category = item.get("category") or "Kita"
#         amount = float(item.get("amount") or 0)

#         totals[category] = totals.get(category, 0) + amount

#     items_total = round(sum(totals.values()), 2)
#     difference = round(total_amount - items_total, 2)

#     if difference > 0:
#         totals["Kita"] = totals.get("Kita", 0) + difference

#     elif difference < 0 and totals:
#         largest_category = max(
#             totals,
#             key=lambda category: totals[category]
#         )

#         totals[largest_category] = totals[largest_category] + difference

#     category_totals = [
#         {
#             "category": category,
#             "amount": round(amount, 2),
#             "description": f"{store_name} - {category}"
#         }
#         for category, amount in totals.items()
#         if round(amount, 2) > 0
#     ]

#     ai_result["category_totals"] = category_totals

#     non_other_totals = [
#         item for item in category_totals
#         if item["category"] != "Kita"
#     ]

#     if non_other_totals:
#         ai_result["category"] = max(
#             non_other_totals,
#             key=lambda item: item["amount"]
#         )["category"]

#     ai_result["save_preview"] = {
#         "receipt": {
#             "store_name": store_name,
#             "receipt_date": receipt_date,
#             "total_amount": round(total_amount, 2),
#             "file_path": None,
#             "ocr_text": None
#         },
#         "expenses": [
#             {
#                 "description": item["description"],
#                 "amount": item["amount"],
#                 "expense_date": receipt_date,
#                 "category_name": item["category"]
#             }
#             for item in category_totals
#         ]
#     }

#     return ai_result
