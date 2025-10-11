import os
import time
import requests
import urllib.parse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import glob

# Configuration
DOWNLOAD_COUNT = 10
DELAY_BETWEEN_DOWNLOADS = 1
DELAY_BETWEEN_SEARCHES = 3

def find_txt_files(base_folder):
    """Find all .txt files in the base folder and subfolders"""
    txt_files = []
    for root, dirs, files in os.walk(base_folder):
        for file in files:
            if file.endswith('.txt'):
                txt_files.append(os.path.join(root, file))
    return txt_files

def read_search_query(txt_file_path):
    """Read the content of txt file to use as search query"""
    try:
        with open(txt_file_path, 'r', encoding='utf-8') as file:
            content = file.read().strip()
            # Use first line or first 50 characters as search query
            search_query = content.split('\n')[0][:50] if content else "general"
            return search_query
    except Exception as e:
        print(f"Error reading {txt_file_path}: {e}")
        return "general"

def download_image(image_url, folder_path, image_count):
    """Download a single image"""
    try:
        # Create filename
        filename = f"google_image_{image_count}.jpg"
        filepath = os.path.join(folder_path, filename)

        # Set headers to mimic browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        # Download image
        response = requests.get(image_url, headers=headers, timeout=10)
        response.raise_for_status()

        # Save image
        with open(filepath, 'wb') as f:
            f.write(response.content)

        print(f"  Downloaded: {filename}")
        return True

    except Exception as e:
        print(f"  Error downloading image {image_count}: {e}")
        return False

def search_google_images(driver, query):
    """Search Google Images and return image URLs"""
    image_urls = []

    try:
        # Navigate to Google Images
        driver.get("https://images.google.com/")

        # Wait for search box and enter query
        search_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "q"))
        )

        search_box.clear()
        search_box.send_keys(query)
        search_box.send_keys(Keys.RETURN)

        # Wait for results to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "img[data-src]"))
        )

        # Scroll to load more images
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

        # Extract image URLs
        img_elements = driver.find_elements(By.CSS_SELECTOR, "img[data-src]")[:20]

        for img in img_elements:
            try:
                img_url = img.get_attribute("data-src") or img.get_attribute("src")
                if img_url and img_url.startswith('http') and 'google' not in img_url:
                    image_urls.append(img_url)
                    if len(image_urls) >= DOWNLOAD_COUNT:
                        break
            except:
                continue

    except Exception as e:
        print(f"Error searching for '{query}': {e}")

    return image_urls

def main():
    """Main function to process all txt files"""
    # Setup Selenium WebDriver
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # Run in headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(service=Service(), options=options)

    try:
        # Find all txt files
        txt_files = find_txt_files("2025-10-03")

        print(f"Found {len(txt_files)} text files to process")

        for txt_file in txt_files:
            folder_path = os.path.dirname(txt_file)
            search_query = read_search_query(txt_file)

            print(f"\n{'='*50}")
            print(f"Processing: {os.path.basename(txt_file)}")
            print(f"Search query: '{search_query}'")
            print(f"Folder: {folder_path}")

            # Search Google Images
            image_urls = search_google_images(driver, search_query)

            if not image_urls:
                print(f"No images found for '{search_query}'")
                continue

            print(f"Found {len(image_urls)} images, downloading {min(DOWNLOAD_COUNT, len(image_urls))}...")

            # Download images
            downloaded_count = 0
            for i, img_url in enumerate(image_urls[:DOWNLOAD_COUNT], 1):
                print(f"Downloading image {i}/{min(DOWNLOAD_COUNT, len(image_urls))}...")
                if download_image(img_url, folder_path, i):
                    downloaded_count += 1

                time.sleep(DELAY_BETWEEN_DOWNLOADS)

            print(f"Successfully downloaded {downloaded_count} images to {folder_path}")
            time.sleep(DELAY_BETWEEN_SEARCHES)

    finally:
        driver.quit()

    print(f"\n{'='*50}")
    print("Process completed!")

if __name__ == "__main__":
    main()
