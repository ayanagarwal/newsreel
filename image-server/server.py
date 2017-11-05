import time       #Importing the time library to check the time of code execution
import sys    #Importing the System Library
import os
import socket

from flask import Flask
from flask import request
from flask import jsonify

version = (3,0)
cur_version = sys.version_info
if cur_version >= version: #If the Current Version of Python is 3.0 or above
	#urllib library for Extracting web pages
	from urllib.request import Request, urlopen
	from urllib.request import URLError, HTTPError
	from urllib.parse import urlparse
else: #If the Current Version of Python is 2.x
	#urllib library for Extracting web pages
	from urllib2 import Request, urlopen
	from urllib2 import URLError, HTTPError
	from urlparse import urlparse



app = Flask(__name__)



@app.route('/')
def server():
	t0 = time.time()   #start the timer
	content = request.args.get('content')
	if (content):
		return get_content_url(content)

	return ''



def get_content_url(content):
	content = " ".join([x for x in content.split()][:32])
	search = content.replace(' ','%20')
	url = 'https://www.google.com/search?q=' + search + '&espv=2&biw=1366&bih=667&site=webhp&source=lnms&tbm=isch&sa=X&ei=XosDVaCXD8TasATItgE&ved=0CAcQ_AUoAg'
	raw_html = (download_page(url))
	time.sleep(0.1)
	items = (_images_get_all_items(raw_html, 5))
	
	validURL = False
	k = 0
	while(k < len(items)):
			validURL = domain_check(items[k])
			if (validURL):
				break
			k+=1
	
	if (items):
		return jsonify({'url':items[k]})
	else:
		return jsonify({'url':''})



def domain_check(url):
	parts = urlparse(url)
	try:
		socket.gethostbyname(parts.netloc)
	except:
		return False
	return True



def download_page(url):
	version = (3,0)
	cur_version = sys.version_info
	if cur_version >= version:		#If the Current Version of Python is 3.0 or above
		import urllib.request 		#urllib library for Extracting web pages
		try:
			headers = {}
			headers['User-Agent'] = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
			req = urllib.request.Request(url, headers = headers)
			resp = urllib.request.urlopen(req)
			respData = str(resp.read())
			return respData
		except Exception as e:
			print(str(e))
	else:							#If the Current Version of Python is 2.x
		import urllib2
		try:
			headers = {}
			headers['User-Agent'] = "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.27 Safari/537.17"
			req = urllib2.Request(url, headers = headers)
			response = urllib2.urlopen(req)
			page = response.read()
			return page
		except:
			return"Page Not found"



#Finding 'Next Image' from the given raw page
def _images_get_next_item(s):
	start_line = s.find('rg_di')
	if start_line == -1:    #If no links are found then give an error!
		end_quote = 0
		link = "no_links"
		return link, end_quote
	else:
		start_line = s.find('"class="rg_meta"')
		start_content = s.find('"ou"',start_line+1)
		end_content = s.find(',"ow"',start_content+1)
		content_raw = str(s[start_content+6:end_content-1])
		return content_raw, end_content



#Getting all links with the help of '_images_get_next_image'
def _images_get_all_items(page, limit):
	items = []
	while True:
		item, end_content = _images_get_next_item(page)
		if item == "no_links":
			break
		else:
			items.append(item)		#Append all the links in the list named 'Links'
			time.sleep(0.1)			#Timer could be used to slow down the request for image downloads
			page = page[end_content:]
		if (limit > 0):
			if (len(items) > limit):
				break
	return items



if __name__ == "__main__":
  app.run()