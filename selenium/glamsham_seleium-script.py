import os
import re
import time
from datetime import datetime
from urllib.parse import urljoin
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup

# --- CONFIG ---
BASE_URL = "https://www.glamsham.com"

HEADERS = {"User-Agent": "Mozilla/5.0"}

# Today's date folder
today = datetime.today().strftime("%Y-%m-%d")
if not os.path.exists(today):
    os.makedirs(today)

# Utility: clean folder names
def sanitize_filename(name):
    return re.sub(r'[^a-zA-Z0-9_\-]', '_', name)[:50]

# Utility: download images/videos
def download_file(url, folder):
    local_filename = url.split("/")[-1].split("?")[0]
    filepath = os.path.join(folder, local_filename)

    try:
        r = requests.get(url, stream=True, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            with open(filepath, "wb") as f:
                for chunk in r.iter_content(1024):
                    f.write(chunk)
            print(f"📥 Saved: {filepath}")
        else:
            print(f"❌ Skipped {url} (status {r.status_code})")
    except Exception as e:
        print(f"⚠️ Error downloading {url}: {e}")

# --- Start Selenium (Chrome in headless mode) ---
options = webdriver.ChromeOptions()
# options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

driver = webdriver.Chrome(service=Service(), options=options)
items = ["bollywood/movie-review/", "hollywood/critic-review/", "ott/web-review/", ""]
urls = []

for every_item in items:
    START_URL = "https://www.glamsham.com/" + every_item
    driver.get(START_URL)
    driver.implicitly_wait(40)
    time.sleep(10)
    articles = driver.find_elements(By.XPATH, "//div[contains(@class,'td_module_flex')]")
    article_count = 0
    max_articles = 10
    print(f"Found {len(articles)} articles in {START_URL}")
    for article in articles:
        if article_count >= max_articles:
            break

        if article.find_elements(By.XPATH, ".//a[@href]") is not None:
            print("====>> " + str(article.find_element(By.XPATH, ".//a[@href]").get_attribute("href")))
            urls.append(article.find_element(By.XPATH, ".//a[@href]").get_attribute("href"))
            print(f"📰 Found {article.find_element(By.XPATH, ".//a[@href]").get_attribute("href")} link")
            article_count += 1

for url in urls:
    
    # Open article page
    driver.get(url)
    time.sleep(5)
    
    title_tag = driver.find_element(By.XPATH, "//h1")
    title = title_tag.text
    folder_name = sanitize_filename(title[:20])
    print("Folder name is " + folder_name)
    post_folder = os.path.join(today, folder_name)

    os.makedirs(post_folder, exist_ok=True)
    print(f"\n📰 Scraping: {title}\n   {url}")

    try:
        # Save HTML
        page_source = driver.page_source
        html_path = os.path.join(post_folder, "article.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(page_source)
        print(f"✅ Saved HTML to {html_path}")

        # Save article title as text file
        title_filename = sanitize_filename(title) + ".txt"
        title_path = os.path.join(post_folder, title_filename)
        with open(title_path, "w", encoding="utf-8") as f:
            f.write(title)
        print(f"✅ Saved title to {title_path}")

        # Download images
        images = driver.find_elements(By.XPATH,"//div[@class='pv-img-wrap ar169']//img")
        
        for img in images:
            src = img.get_attribute("src")
            if src:
                img_url = src
                download_file(img_url, post_folder)
    except:
        print(" error happened for " + url + "... trying another one")
    # # Download videos
    # for video in article_soup.find_all(["video", "source"]):
    #     src = video.get("src")
    #     if src and (".mp4" in src or ".webm" in src):
    #         vid_url = urljoin(BASE_URL, src)
    #         download_file(vid_url, post_folder)

driver.quit()
print("\n🎉 Scraping complete!")
