from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["icrop_db"]
users = db["users"]

# Insert a test user
users.insert_one({"email": "test@example.com", "password": "1234"})
print("✅ Test user inserted")
