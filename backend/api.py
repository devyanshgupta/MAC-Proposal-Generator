from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import uvicorn
from pydantic import BaseModel

class Service(BaseModel):
    category: str
    service: str
    price: float
    billingCycle: str

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/api/services")
def get_services():
    df = pd.read_csv("backend/services.csv")
    #df.columns = df.columns.str.lower()
    index = []
    for i,row_data in df.iterrows():
        index.append(f"{row_data["category"][0:3].lower()}-{i+1}")
    df["id"] = index
    columns_in_order = ["id"]
    for i in df.columns:
        columns_in_order.append(i)
    df = df[columns_in_order]
    #df.to_csv("backend/services.csv", index=False)

    return df.to_dict(orient="records")

@app.post("/api/services")
def add_service(service: Service):
    df = pd.read_csv("backend/services.csv")
    new_id = f"{service.category[0:3].lower()}-{len(df) + 1}"
    new_service = {
        "category": service.category,
        "service": service.service,
        "price": service.price,
        "billingCycle": service.billingCycle,
    }
    df = df._append(new_service, ignore_index=True)
    df.to_csv("backend/services.csv", index=False)
    return new_service

if __name__ == '__main__':
    x=Service(category="hahaha",service="hehehe",price=23423,billingCycle="monthly")
    add_service(x)
    df = pd.read_csv("backend/services.csv")
    print(df)
    #uvicorn.run("api:app", host="0.0.0.0", port=8000)