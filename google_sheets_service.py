import requests
import logging
import base64
from urllib.parse import urlencode

class GoogleSheetsService:
    def __init__(self):
        self.base_url = "https://script.google.com/macros/s/AKfycbwMFzmXiZcFPGD-7T9ed9WGTOPr6wjjFIE0Oqw4X-FEfxvTpPsfFEtR0FHbUhR2rqk-PA/exec"
        self.logger = logging.getLogger(__name__)
    
    def _make_request(self, method='GET', params=None, data=None):
        """Make HTTP request to Google Apps Script endpoint"""
        try:
            if method == 'GET':
                response = requests.get(self.base_url, params=params, timeout=30)
            else:
                response = requests.post(self.base_url, data=data, timeout=30)
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Request failed: {str(e)}")
            raise Exception(f"Failed to connect to Google Sheets API: {str(e)}")
        except ValueError as e:
            self.logger.error(f"Invalid JSON response: {str(e)}")
            raise Exception("Invalid response from Google Sheets API")
    
    def read_data(self, sheet_name):
        """Read all data from a specific sheet"""
        params = {
            'sheet': sheet_name,
            'action': 'read'
        }
        return self._make_request('GET', params=params)
    
    def create_data(self, sheet_name, data):
        """Create new record in a specific sheet"""
        payload = {
            'sheet': sheet_name,
            'action': 'create',
            **data
        }
        return self._make_request('POST', data=payload)
    
    def update_data(self, sheet_name, data):
        """Update existing record in a specific sheet"""
        payload = {
            'sheet': sheet_name,
            'action': 'update',
            **data
        }
        return self._make_request('POST', data=payload)
    
    def delete_data(self, sheet_name, data):
        """Delete record from a specific sheet"""
        payload = {
            'sheet': sheet_name,
            'action': 'delete',
            **data
        }
        return self._make_request('POST', data=payload)
    
    def upload_image(self, image_data):
        """Upload image to Google Drive via Apps Script"""
        try:
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            payload = {
                'action': 'upload_image',
                'image_data': image_data
            }
            
            response = self._make_request('POST', data=payload)
            return response.get('url', '')
        except Exception as e:
            self.logger.error(f"Image upload failed: {str(e)}")
            raise Exception(f"Failed to upload image: {str(e)}")
