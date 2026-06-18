import os
from PIL import Image

def resize_image(image_path, max_size):
    try:
        with Image.open(image_path) as img:
            orig_size = os.path.getsize(image_path)
            
            # Check if it's already small in dimensions (avoid upscaling)
            if img.width <= max_size and img.height <= max_size:
                # Still re-save to optimize compression/quality
                img.save(image_path, "WEBP", quality=80, optimize=True)
                new_size = os.path.getsize(image_path)
                print(f"Optimized (no resize) {os.path.basename(image_path)}: {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB")
                return

            # Calculate new size maintaining aspect ratio
            ratio = min(max_size / img.width, max_size / img.height)
            new_width = int(img.width * ratio)
            new_height = int(img.height * ratio)
            
            resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            resized_img.save(image_path, "WEBP", quality=80, optimize=True)
            
            new_size = os.path.getsize(image_path)
            print(f"Resized {os.path.basename(image_path)} ({img.width}x{img.height} -> {new_width}x{new_height}): {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to restaurant uploads
    restaurants_dir = os.path.join(base_dir, "api", "public", "uploads", "restaurants")
    if os.path.exists(restaurants_dir):
        print("Processing restaurant images...")
        for filename in os.listdir(restaurants_dir):
            if filename.lower().endswith(".webp"):
                resize_image(os.path.join(restaurants_dir, filename), 600)
                
    # Path to category uploads
    categories_dir = os.path.join(base_dir, "api", "public", "uploads", "categories")
    if os.path.exists(categories_dir):
        print("\nProcessing category images...")
        for filename in os.listdir(categories_dir):
            if filename.lower().endswith(".webp"):
                resize_image(os.path.join(categories_dir, filename), 300)

if __name__ == "__main__":
    main()
