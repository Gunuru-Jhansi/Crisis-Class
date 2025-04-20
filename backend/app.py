# from flask import Flask, request, jsonify
# from flask_jwt_extended import create_access_token, jwt_required, JWTManager,get_jwt_identity, get_jwt
# from flask_cors import CORS
# from mongoengine import connect
# from Models.user import User
# from Models.adminMsgs import UserMessage


# from dotenv import load_dotenv
# import os

# from transformers import BertTokenizer, BertForSequenceClassification
# import torch


# from geopy.geocoders import Nominatim
# from geopy.exc import GeocoderUnavailable



# # Replace with your actual path to ffmpeg.exe
# os.environ["PATH"] += os.pathsep + r"C:\ffmpeg\ffmpeg-master-latest-win64-gpl-shared\bin"

# def get_location(lat, lon):
#     try:
#         geolocator = Nominatim(user_agent="srivallikoppanapudi@gmail.com", timeout=10)
#         location = geolocator.reverse((lat, lon), exactly_one=True)
#         return location.address if location else "Unknown location"
#     except GeocoderUnavailable as e:
#         print("Geocoding service is unavailable:", e)
#         return "Location service unavailable"


# # Import Gemini
# import google.generativeai as genai  # type: ignore

# # Configure Gemini API Key
#

# # Load the Gemini model
# gemini_model = genai.GenerativeModel("gemini-1.5-pro")

# # Translation Function
# def translate_with_gemini(text, target_lang="English"):
#     # prompt = f"Translate this to {target_lang}:\n{text}"
#     prompt = f"Translate the following to {target_lang}, and return only the translated sentence without any explanation or extra content:\n{text}"
#     response = gemini_model.generate_content(prompt)
#     # return response.text.strip()  
#     cleaned = response.text.strip().split('\n')[0]
#     return cleaned





# app = Flask(__name__)

# load_dotenv()
# # 🔹 MongoDB Connection
# connect(db="disasterManagement", host=os.getenv("MONGO_URI"))

# # 🔹 Configure JWT Authentication
# app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# from datetime import timedelta

# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=365*100)  # 100 years

# jwt = JWTManager(app)

# # 🔹 Enable CORS
# # CORS(app, supports_credentials=True)
# CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}}, expose_headers=["Authorization"])



# @app.route("/")
# def hello_world():
#     return "Hello, World!"


# # 🔹 REGISTER Route
# @app.route("/register", methods=["POST"])
# def register():
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")
#     role = data.get("role", "user")  # default to 'user'




#     if not email or not password:
#         return jsonify({"error": "Missing required fields"}), 400

#     if User.objects(email=email):
#         return jsonify({"error": "Email already exists"}), 409

#     new_user = User(email=email, password=password,role=role)
#     new_user.hash_password()  # Hash password before saving
#     new_user.save()

#     return jsonify({"id": str(new_user.id), "email": new_user.email}), 201


# # 🔹 LOGIN Route (Generates JWT Token)
# @app.route("/login", methods=["POST"])
# def login():
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")

#     user = User.objects(email=email).first()

#     if not user or not user.check_password(password):
#         return jsonify({"error": "Unauthorized Access"}), 401

#     # access_token = create_access_token(identity=user.email)
#     access_token = create_access_token(
#     identity=user.email,
#     additional_claims={"role": user.role}
#     )

    

#     return jsonify({"token": access_token, "email": user.email,"role": user.role}), 200


# # 🔹 PROTECTED ROUTE (Only Accessible with JWT Token)
# @app.route("/dashboard", methods=["GET"])
# #@jwt_required()
# @jwt_required()
# def dashboard():
#     return jsonify({"message": "Welcome to the admin dashboard!"})


# # 🔹 LOCATION SUBMISSION
# """ @app.route('/submitLocation', methods=['POST'])
# @jwt_required()
# def receive_location():
#     print("Headers:", request.headers)
#     print("JSON Payload:", request.json)
#     data = request.json
#     print("Received JSON:", data)
#     email = data.get("email")
#     latitude = data.get("latitude")
#     longitude = data.get("longitude")
#     global message
#     message=data.get("message")
#     location=get_location(latitude,longitude)
    

#     if email and latitude and longitude and message:
#         print(f"Received location - Email: {email}, Latitude: {latitude}, Longitude: {longitude} location:{location}")
#         # return jsonify({"message": "Location received successfully!"}), 200
#         try:
#             # Translate the message to English using Gemini
#             translated_message = translate_with_gemini(message)
#             print(f"Original Message: {message}")
#             print(f"Translated Message: {translated_message}")
#             user_msg = UserMessage(email=email, message=message, location=location)
#             user_msg.save()
#             # return jsonify({"message": "Data saved successfully!"}), 201
#         except Exception as e:
#             import traceback
#             print("Error occurred:", traceback.format_exc())  # Print full error trace
#             return jsonify({"error": str(e)}), 500
#         finally:
#             inputs = tokenizer(message, return_tensors="pt", padding=True, truncation=True, max_length=96)
#             with torch.no_grad():
#                 outputs = model(**inputs)
#                 probs = torch.sigmoid(outputs.logits).squeeze().numpy()
#                 preds = (probs > 0.5).astype(int)

#             # Get predicted labels
#             predicted_labels = [categories[i] for i, val in enumerate(preds) if val == 1]
#             print(predicted_labels)
            

#             return jsonify({
#                 "message": message,
#                 "predicted_categories": predicted_labels
#             })

#     else:
#         return jsonify({"error": "Invalid data received"}), 400"""



# import tempfile
# import whisper

# amodel = whisper.load_model("base")
# @app.route('/submitLocation', methods=['POST'])
# @jwt_required()
# def receive_location():
#     email = request.form.get("email")
#     latitude = request.form.get("latitude")
#     longitude = request.form.get("longitude")
#     message = request.form.get("message")

#     print(email)
#     print(latitude)
#     print(longitude)
#     print(message)

#     # Get human-readable location
#     location = get_location(latitude, longitude)

#     # If audio is present, transcribe and overwrite message
#     if 'audio' in request.files:
#         audio_file = request.files['audio']
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp:
#             audio_file.save(temp.name)
#             temp_path = temp.name
#             temp.flush()
#         result = amodel.transcribe(temp_path, task="translate")  # Auto-detects and translates to English
#         print("Detected Text:", result["text"])
#         message = result["text"]
#     translated_message=message
        

#     # Validate final message
#     if not message:
#         return jsonify({"error": "No message provided"}), 400

#     if email and latitude and longitude and message:
#         print(f"Received location - Email: {email}, Latitude: {latitude}, Longitude: {longitude} location: {location}")
#         try:
#             # Translate using Gemini
#             translated_message = translate_with_gemini(message)
#             print(f"Original Message: {message}")
#             print(f"Translated Message: {translated_message}")

#             # Save user message
#             user_msg = UserMessage(email=email, message=translated_message, location=location)
#             user_msg.save()

#         except Exception as e:
#             import traceback
#             print("Error occurred:", traceback.format_exc())
#             return jsonify({"error": str(e)}), 500

#         finally:
#             # Predict categories
#             inputs = tokenizer(translated_message, return_tensors="pt", padding=True, truncation=True, max_length=96)
#             with torch.no_grad():
#                 outputs = model(**inputs)
#                 probs = torch.sigmoid(outputs.logits).squeeze().numpy()
#                 preds = (probs > 0.5).astype(int)
                
#             predicted_labels = [categories[i] for i, val in enumerate(preds) if val == 1]
#             print(predicted_labels)



#             return jsonify({
#                 "message": translated_message,
#                 "predicted_categories": predicted_labels
#             })
#     else:
#         return jsonify({"error": "Invalid or incomplete data received"}), 400




# @app.route("/get_messages", methods=["GET"])
# @jwt_required()
# def get_messages():
#     try:
#         messages = UserMessage.objects()  # Fetch all messages
#         messages_list = [
#         {"id": str(msg.id), "email": msg.email, "message": msg.message, "location": msg.location}
#         for msg in messages
#         ]

#         return jsonify(messages_list), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# # 🔹 DELETE MESSAGE (Admin Page)
# @app.route("/delete_message/<message_id>", methods=["DELETE"])
# @jwt_required()
# def delete_message(message_id):
#     try:
#         user_msg = UserMessage.objects(id=message_id).first()
#         if not user_msg:
#             return jsonify({"error": "Message not found"}), 404
        
#         user_msg.delete()
#         return jsonify({"message": "Message deleted successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# # Load model & tokenizer
# model_path = "./model"
# tokenizer = BertTokenizer.from_pretrained(model_path)
# model = BertForSequenceClassification.from_pretrained(model_path)
# model.eval()

# # Category labels (example)
# categories = [
#     "Communication", "Electricity", "Food", "Infrastructure", "Medical",
#     "Not Related", "Rescue", "Sanitation & Hygiene", "Shelter",
#     "Transportation", "Water"
# ]


# @jwt.unauthorized_loader
# def unauthorized_response(callback):
#     print("❌ Unauthorized:", callback)
#     return jsonify({"error": "Missing or invalid JWT"}), 401

# @jwt.invalid_token_loader
# def invalid_token_loader(error):
#     print("❌ Invalid token:", error)
#     return jsonify({"error": "Invalid JWT"}), 422




# if __name__ == "__main__":
#     app.run(debug=False)





from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from Models.request_log import RequestLog
from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, JWTManager,get_jwt_identity, get_jwt
from flask_cors import CORS
from mongoengine import connect
from Models.user import User
from Models.adminMsgs import UserMessage
import smtplib
from email.message import EmailMessage
from Models.category_counter import CategoryCounts


from dotenv import load_dotenv
import os

from transformers import BertTokenizer, BertForSequenceClassification
import torch


from geopy.geocoders import Nominatim
from geopy.exc import GeocoderUnavailable



# Replace with your actual path to ffmpeg.exe
os.environ["PATH"] += os.pathsep + r"C:\ffmpeg\ffmpeg-master-latest-win64-gpl-shared\bin"

def get_location(lat, lon):
    try:
        geolocator = Nominatim(user_agent="srivallikoppanapudi@gmail.com", timeout=10)
        location = geolocator.reverse((lat, lon), exactly_one=True)
        return location.address if location else "Unknown location"
    except GeocoderUnavailable as e:
        print("Geocoding service is unavailable:", e)
        return "Location service unavailable"


# Import Gemini
import google.generativeai as genai  # type: ignore

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Configure Gemini API Key
genai.configure(api_key=GEMINI_API_KEY)

# Load the Gemini model
gemini_model = genai.GenerativeModel("gemini-1.5-pro")

# Translation Function
def translate_with_gemini(text, target_lang="English"):
    # prompt = f"Translate this to {target_lang}:\n{text}"
    prompt = f"Translate the following to {target_lang}, and return only the translated sentence without any explanation or extra content:\n{text}"
    response = gemini_model.generate_content(prompt)
    # return response.text.strip()  
    cleaned = response.text.strip().split('\n')[0]
    return cleaned

category_email_info = {
    "Medical": {
        "message": "Urgent medical assistance is needed in the affected area.",
        "email": "gunurujhansi@gmail.com"
    },
    "Rescue": {
        "message": "Search and rescue operations are required immediately.",
        "email": "gunurujhansi@gmail.com"
    },
    "Shelter": {
        "message": "Temporary shelters are needed for displaced individuals.",
        "email": "gunurujhansi@gmail.com"
    },
    "Water": {
        "message": "There's a shortage of clean drinking water.",
        "email": "gunurujhansi@gmail.com"
    },
    "Food": {
        "message": "Food supply is critically low and needs replenishment.",
        "email": "gunurujhansi@gmail.com"
    },
    "Electricity": {
        "message": "Power outage reported, request restoration services.",
        "email": "gunurujhansi@gmail.com"
    },
    "Transportation": {
        "message": "Transport routes blocked or damaged, need support.",
        "email": "gunurujhansi@gmail.com"
    },
    "Sanitation & Hygiene": {
        "message": "Sanitation facilities are disrupted, risk of disease.",
        "email": "gunurujhansi@gmail.com"
    },
    "Communication": {
        "message": "Communication lines are down in the affected area.",
        "email": "gunurujhansi@gmail.com"
    },
    "Infrastructure": {
        "message": "Structural damages reported, urgent assessment needed.",
        "email": "gunurujhansi@gmail.com"
    },
    "Not Related": {
        "message": "No disaster response required for this message.",
        "email": None  # No email needed
    }
}





app = Flask(__name__)
scheduler = BackgroundScheduler()

load_dotenv()
# 🔹 MongoDB Connection
connect(db="disasterManagement", host=os.getenv("MONGO_URI"))

# 🔹 Configure JWT Authentication
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

from datetime import timedelta

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=365*100)  # 100 years

jwt = JWTManager(app)

# 🔹 Enable CORS
# CORS(app, supports_credentials=True)
#CORS(app, supports_credentials=True, resources={r"/": {"origins": ""}}, expose_headers=["Authorization"])
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    expose_headers=["Authorization"]
)



@app.route("/")
def hello_world():
    return "Hello, World!"


# 🔹 REGISTER Route
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")  # default to 'user'




    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if User.objects(email=email):
        return jsonify({"error": "Email already exists"}), 409

    new_user = User(email=email, password=password,role=role)
    new_user.hash_password()  # Hash password before saving
    new_user.save()

    return jsonify({"id": str(new_user.id), "email": new_user.email}), 201


# 🔹 LOGIN Route (Generates JWT Token)
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.objects(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Unauthorized Access"}), 401

    # access_token = create_access_token(identity=user.email)
    access_token = create_access_token(
    identity=user.email,
    additional_claims={"role": user.role}
    )

    

    return jsonify({"token": access_token, "email": user.email,"role": user.role}), 200


# 🔹 PROTECTED ROUTE (Only Accessible with JWT Token)
@app.route("/dashboard", methods=["GET"])
#@jwt_required()
@jwt_required()
def dashboard():
    return jsonify({"message": "Welcome to the admin dashboard!"})


# 🔹 LOCATION SUBMISSION
""" @app.route('/submitLocation', methods=['POST'])
@jwt_required()
def receive_location():
    print("Headers:", request.headers)
    print("JSON Payload:", request.json)
    data = request.json
    print("Received JSON:", data)
    email = data.get("email")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    global message
    message=data.get("message")
    location=get_location(latitude,longitude)
    

    if email and latitude and longitude and message:
        print(f"Received location - Email: {email}, Latitude: {latitude}, Longitude: {longitude} location:{location}")
        # return jsonify({"message": "Location received successfully!"}), 200
        try:
            # Translate the message to English using Gemini
            translated_message = translate_with_gemini(message)
            print(f"Original Message: {message}")
            print(f"Translated Message: {translated_message}")
            user_msg = UserMessage(email=email, message=message, location=location)
            user_msg.save()
            # return jsonify({"message": "Data saved successfully!"}), 201
        except Exception as e:
            import traceback
            print("Error occurred:", traceback.format_exc())  # Print full error trace
            return jsonify({"error": str(e)}), 500
        finally:
            inputs = tokenizer(message, return_tensors="pt", padding=True, truncation=True, max_length=96)
            with torch.no_grad():
                outputs = model(**inputs)
                probs = torch.sigmoid(outputs.logits).squeeze().numpy()
                preds = (probs > 0.5).astype(int)

            # Get predicted labels
            predicted_labels = [categories[i] for i, val in enumerate(preds) if val == 1]
            print(predicted_labels)
            

            return jsonify({
                "message": message,
                "predicted_categories": predicted_labels
            })

    else:
        return jsonify({"error": "Invalid data received"}), 400"""



import tempfile
import whisper

amodel = whisper.load_model("base")
@app.route('/submitLocation', methods=['POST'])
@jwt_required()
def receive_location():
    email = request.form.get("email")
    latitude = request.form.get("latitude")
    longitude = request.form.get("longitude")
    message = request.form.get("message")
    emergency=request.form.get("emergency")

    print(email)
    print(latitude)
    print(longitude)
    print(message)
    print(emergency)
    print(type(emergency))
    # Get human-readable location
    location = get_location(latitude, longitude)

    # If audio is present, transcribe and overwrite message
    if 'audio' in request.files:
        audio_file = request.files['audio']
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp:
            audio_file.save(temp.name)
            temp_path = temp.name
            temp.flush()
        result = amodel.transcribe(temp_path, task="translate")  # Auto-detects and translates to English
        print("Detected Text:", result["text"])
        message = result["text"]
    translated_message=message
        

    # Validate final message
    if not message:
        return jsonify({"error": "No message provided"}), 400

    if email and latitude and longitude and message:
        print(f"Received location - Email: {email}, Latitude: {latitude}, Longitude: {longitude} location: {location}")
        try:
            # Translate using Gemini
            translated_message = translate_with_gemini(message)
            print(f"Original Message: {message}")
            print(f"Translated Message: {translated_message}")

            

        except Exception as e:
            import traceback
            print("Error occurred:", traceback.format_exc())
            return jsonify({"error": str(e)}), 500

        finally:
            # Predict categories
            inputs = tokenizer(translated_message, return_tensors="pt", padding=True, truncation=True, max_length=96)
            with torch.no_grad():
                outputs = model(**inputs)
                probs = torch.sigmoid(outputs.logits).squeeze().numpy()
                preds = (probs > 0.5).astype(int)
                
            predicted_labels = [categories[i] for i, val in enumerate(preds) if val == 1]
            classification_dict = {categories[i]: float(probs[i]) for i, val in enumerate(preds) if val == 1}
            print(predicted_labels)
            print("Final predicted categories:", predicted_labels)
            # Save user message with classification results
            status='pending'
            if(emergency=='true'):
                status='resolved'

            user_msg = UserMessage(
            email=email,
            message=translated_message,
            location=location,
            classification=classification_dict,
            status=status,
            is_emergency=(emergency == 'true')  # store boolean flag
            )
            user_msg.save()

            if(emergency=='true'):
                handle_classification_and_email(predicted_labels)
            else:

                update_category_counts(predicted_labels)
                # After prediction is done
                log_requests(predicted_labels,user_msg)


            return jsonify({
                "message": translated_message,
                "predicted_categories": predicted_labels
            })
    else:
        return jsonify({"error": "Invalid or incomplete data received"}), 400




@app.route("/get_messages_admin", methods=["GET"])
@jwt_required()
def get_messages_admin():
    try:
        messages = UserMessage.objects()  # Fetch all messages
        messages_list = [
        {"id": str(msg.id), "email": msg.email, "message": msg.message, "location": msg.location}
        for msg in messages
        ]

        return jsonify(messages_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500 


# 🔹 DELETE MESSAGE (Admin Page)
@app.route("/delete_message/<message_id>", methods=["DELETE"])
@jwt_required()
def delete_message(message_id):
    try:
        user_msg = UserMessage.objects(id=message_id).first()
        if not user_msg:
            return jsonify({"error": "Message not found"}), 404
        
        user_msg.delete()
        return jsonify({"message": "Message deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Load model & tokenizer
model_path = "./model"
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)
model.eval()

# Category labels (example)
categories = [
    "Communication", "Electricity", "Food", "Infrastructure", "Medical",
    "Not Related", "Rescue", "Sanitation & Hygiene", "Shelter",
    "Transportation", "Water"
]




if CategoryCounts.objects.count() == 0:
    CategoryCounts().save()


def update_category_counts(predicted_labels):
    label_mapping = {
        "Communication": "communication",
        "Electricity": "electricity",
        "Food": "food",
        "Infrastructure": "infrastructure",
        "Medical": "medical",
        "Not Related": "not_related",
        "Rescue": "rescue",
        "Sanitation & Hygiene": "sanitation_and_hygiene",
        "Shelter": "shelter",
        "Transportation": "transportation",
        "Water": "water",
    }

    counts = CategoryCounts.objects.first()
    if not counts:
        counts = CategoryCounts()

    for label in predicted_labels:
        field = label_mapping.get(label)
        if field and hasattr(counts, field):
            current_value = getattr(counts, field)
            setattr(counts, field, current_value + 1)

    counts.save()




def log_requests(predicted_labels,user_msg):
    for label in predicted_labels:
        RequestLog(category=label,message=user_msg).save()

def send_summary_emails():
    two_minutes_ago = datetime.utcnow() - timedelta(minutes=2)
    recent_requests = RequestLog.objects(timestamp__gte=two_minutes_ago)
    print(recent_requests)

    if not recent_requests:
        return

    # Group by category
    category_data = {}
    for req in recent_requests:
        category_data.setdefault(req.category, []).append(req)

    for category, requests in category_data.items():
        count = len(requests)
        message = f"There have been {count} new '{category}' requests in the past 2 minutes."
        if category != "Not Related" and category in category_email_info:
            info = category_email_info[category]
        # Replace this with actual department email and sending logic
        # send_email(to=f"{category.lower()}@department.com", subject="Disaster Alert", body=message)
            send_email(f"Disaster Alert: {category}", message, info["email"])
            for req in requests:
                print(req)
                user_msg = UserMessage.objects(id=req._id).first()
                if user_msg and user_msg.status != "resolved":
                    user_msg.status = "resolved"
                    user_msg.save()
                    print('updated')



scheduler.add_job(send_summary_emails, 'interval', minutes=2)
scheduler.start()

def send_email(subject, content, to_email):
    msg = EmailMessage()
    msg.set_content(content)
    msg["Subject"] = subject
    msg["From"] = "miniprojectml2k25@gmail.com"
    msg["To"] = to_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login("miniprojectml2k25@gmail.com", "iuho huhm gqyi bdif")  # ← Use your real app password
            smtp.send_message(msg)
        print(f" Email sent to {to_email} for category: {subject}")
    except Exception as e:
        import traceback
        print(f" Error sending email to {to_email} for {subject}:")
        print(traceback.format_exc())

# ✅ Handle predicted categories
def handle_classification_and_email(predicted_labels):
    print(f"Predicted Labels for email handling: {predicted_labels}") 
    for category in predicted_labels:
        print(f"Processing category: {category}")  
        if category != "Not Related" and category in category_email_info:
            info = category_email_info[category]
            if info["email"]:
                send_email(f"Disaster Alert: {category}", info["message"], info["email"])
                
            




@app.route('/admin/update-status/<message_id>', methods=['PUT'])
@jwt_required()
def update_message_status(message_id):
    try:
        # Get current user and verify admin status
        current_user_email = get_jwt_identity()
        user = User.objects(email=current_user_email).first()
        if not user or user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403

        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status or new_status not in ['pending', 'in_progress', 'resolved']:
            return jsonify({'error': 'Invalid status'}), 400

        # Update message status
        message = UserMessage.objects(id=message_id).first()
        if not message:
            return jsonify({'error': 'Message not found'}), 404

        message.status = new_status
        message.save()

        return jsonify({
            'success': True,
            'message': 'Status updated successfully'
        })

    except Exception as e:
        print(f"Error in update_message_status: {str(e)}")
        return jsonify({'error': str(e)}), 500


""" 
@app.route('/admin/reports', methods=['GET'])
@jwt_required()
def get_reports():
    try:
        # Get current user and verify admin status
        current_user_email = get_jwt_identity()
        user = User.objects(email=current_user_email).first()
        if not user or user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403

        # Get all reports with location data
        reports = UserMessage.objects().order_by('-timestamp')
        
        
        # Format reports for frontend
        formatted_reports = []
        for report in reports:
            report_data = {
                'id': str(report.id),
                'email': report.email,
                'message': report.message,
                'timestamp': report.timestamp.isoformat(),
                'status': report.status,
                'is_emergency': report.is_emergency
            }
            print(report.is_emergency)
            print(report.classification)
            # Add location data if it exists
           
            if hasattr(report, 'location') and report.location:

                report_data['location'] = report.location  # it's just a string

            
            # Add classification data if it exists
            if hasattr(report, 'classification') and report.classification:
                report_data['classification'] = report.classification
            
            formatted_reports.append(report_data)

        # Get report statistics
        total_reports = len(formatted_reports)
        emergency_reports = sum(1 for r in formatted_reports if r.get('is_emergency')==True)
        pending_reports = sum(1 for r in formatted_reports if r.get('status') == 'pending')

        return jsonify({
            'reports': formatted_reports,
            'statistics': {
                'total': total_reports,
                'emergency': emergency_reports,
                'pending': pending_reports
            }
        })

    except Exception as e:
        print(f"Error in get_reports: {str(e)}")
        return jsonify({'error': str(e)}), 500
 """

@app.route('/admin/reports', methods=['GET'])
@jwt_required()
def get_reports():
    try:
        current_user_email = get_jwt_identity()
        user = User.objects(email=current_user_email).first()
        if not user or user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403

        reports = UserMessage.objects().order_by('-timestamp')

        formatted_reports = []
        for report in reports:
            print(f"is_emergency: {report.is_emergency}")
            print(f"classification: {report.classification}")
            
            report_data = {
                'id': str(report.id),
                'email': report.email,
                'message': report.message,
                'timestamp': report.timestamp.isoformat(),
                'status': report.status,
                'is_emergency': report.is_emergency
            }

            if hasattr(report, 'location') and report.location:
                report_data['location'] = report.location

            if hasattr(report, 'classification') and report.classification:
                report_data['classification'] = report.classification

            formatted_reports.append(report_data)

        total_reports = len(formatted_reports)
        emergency_reports = sum(1 for r in formatted_reports if r.get('is_emergency') is True)
        pending_reports = sum(1 for r in formatted_reports if r.get('status') == 'pending')
        print(emergency_reports)

        return jsonify({
            'reports': formatted_reports,
            'statistics': {
                'total': total_reports,
                'emergency': emergency_reports,
                'pending': pending_reports
            }
        })

    except Exception as e:
        print(f"Error in get_reports: {str(e)}")
        return jsonify({'error': str(e)}), 500



@app.route('/admin/messages', methods=['GET'])
@jwt_required()
def get_admin_messages():
    try:
        # Get current user and verify admin status
        current_user_email = get_jwt_identity()
        user = User.objects(email=current_user_email).first()
        
        if not user or user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403

        # Get all messages
        messages = UserMessage.objects().order_by('-timestamp')
        
        # Format messages for frontend
        formatted_messages = []
        for msg in messages:
            message_data = {
                "id": str(msg.id),
                "email": msg.email,
                "message": msg.message,
                "status": msg.status,
                "timestamp": msg.timestamp.isoformat() if msg.timestamp else None
            }
            
            # Add location data if it exists
            if hasattr(msg, 'location') and msg.location:
                message_data["location"] = msg.location
            
            # Add classification data if it exists
            if hasattr(msg, 'classification') and msg.classification:
                message_data["classification"] = msg.classification
                
            formatted_messages.append(message_data)
            
        print(f"Returning {len(formatted_messages)} messages with location data")
        return jsonify(formatted_messages), 200
    except Exception as e:
        print(f"Error in get_admin_messages: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

@app.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    try:
        # Get all messages
        messages = UserMessage.objects().order_by('-timestamp')
        
        # Format messages for frontend
        formatted_messages = []
        for msg in messages:
            message_dict = {
                'id': str(msg.id),
                'email': msg.email,
                'message': msg.message,
                'timestamp': msg.timestamp.isoformat() if msg.timestamp else None
            }
            # Only add location if it exists
            if hasattr(msg, 'location') and msg.location:
                message_dict['location'] = msg.location
            
            formatted_messages.append(message_dict)

        return jsonify({
            'success': True,
            'messages': formatted_messages,
            'total': len(formatted_messages)
        })

    except Exception as e:
        print(f"Error getting messages: {str(e)}")
        return jsonify({'error': str(e)}), 500
 

@jwt.unauthorized_loader
def unauthorized_response(callback):
    print("❌ Unauthorized:", callback)
    return jsonify({"error": "Missing or invalid JWT"}), 401

@jwt.invalid_token_loader
def invalid_token_loader(error):
    print("❌ Invalid token:", error)
    return jsonify({"error": "Invalid JWT"}), 422




if __name__ == "__main__":
    app.run(debug=False)
