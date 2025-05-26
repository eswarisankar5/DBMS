import cv2
from collections import defaultdict
from ultralytics import YOLO
from datetime import datetime  # 🔸 Import for date & time

model = YOLO('yolov8n.pt')

price_list = {
    'apple': 30.0,     # ₹30 per apple
    'banana': 10.0,    # ₹10 per banana
    'milk': 50.0,      # ₹50 per packet
    'bread': 40.0,     # ₹40 per loaf
    'soda': 35.0,      # ₹35 per bottle
    'bottle': 20.0     # ₹20 per plastic bottle
}

cap = None
last_visible_cart = defaultdict(int)
scanning = False

def start_scanning():
    global cap, scanning, last_visible_cart
    scanning = True
    cap = cv2.VideoCapture(0)
    print("📸 Scanning started. Press 'q' to stop...")

    while scanning:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to capture frame")
            break

        results = model(frame)[0]
        annotated = results.plot()
        current_frame_cart = defaultdict(int)

        for box in results.boxes:
            cls_id = int(box.cls[0])
            class_name = model.names[cls_id].lower()
            print(f"🔍 Detected: {class_name}")
            if class_name in price_list:
                current_frame_cart[class_name] += 1

        last_visible_cart = current_frame_cart.copy()
        cv2.imshow("🛒 Smart Cart View", annotated)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def stop_scanning():
    global scanning
    scanning = False

def generate_bill(send_sms=True):
    total = 0
    now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")  # 📅 Get current date and time
    bill_text = "--- Grocery Bill ---\n"
    bill_text += f"Date: {now}\n\n"

    for item, qty in last_visible_cart.items():
        price = price_list[item]
        subtotal = qty * price
        bill_text += f"{item} x {qty} = ₹{subtotal:.2f}\n"
        total += subtotal

    bill_text += f"\nTOTAL: ₹{total:.2f}"
    print("\n" + bill_text)

    return bill_text, total

