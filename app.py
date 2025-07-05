import os
import logging
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
from google_sheets_service import GoogleSheetsService
import base64

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Initialize Google Sheets service
sheets_service = GoogleSheetsService()

@app.route('/')
def index():
    """Main dashboard with tabbed interface for all sheets"""
    return render_template('index.html')

@app.route('/api/data/<sheet_name>')
def get_sheet_data(sheet_name):
    """Get all data from a specific sheet"""
    try:
        data = sheets_service.read_data(sheet_name)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        app.logger.error(f"Error fetching data from {sheet_name}: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/create/<sheet_name>', methods=['POST'])
def create_record(sheet_name):
    """Create a new record in the specified sheet"""
    try:
        data = request.get_json()
        
        # Handle image upload if present
        if 'image_data' in data and data['image_data']:
            image_url = sheets_service.upload_image(data['image_data'])
            if sheet_name == 'Profile':
                data['Foto_Profil_URL'] = image_url
            elif sheet_name == 'Project':
                data['Gambar_Proyek_URL'] = image_url
            elif sheet_name == 'Certifications':
                data['Gambar_Sertifikasi_URL'] = image_url
            
            # Remove image_data from the payload
            del data['image_data']
        
        result = sheets_service.create_data(sheet_name, data)
        return jsonify({'success': True, 'message': result})
    except Exception as e:
        app.logger.error(f"Error creating record in {sheet_name}: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/update/<sheet_name>/<int:row_id>', methods=['PUT'])
def update_record(sheet_name, row_id):
    """Update a record in the specified sheet"""
    try:
        data = request.get_json()
        data['row'] = row_id
        
        # Handle image upload if present
        if 'image_data' in data and data['image_data']:
            image_url = sheets_service.upload_image(data['image_data'])
            if sheet_name == 'Profile':
                data['Foto_Profil_URL'] = image_url
            elif sheet_name == 'Project':
                data['Gambar_Proyek_URL'] = image_url
            elif sheet_name == 'Certifications':
                data['Gambar_Sertifikasi_URL'] = image_url
            
            # Remove image_data from the payload
            del data['image_data']
        
        result = sheets_service.update_data(sheet_name, data)
        return jsonify({'success': True, 'message': result})
    except Exception as e:
        app.logger.error(f"Error updating record in {sheet_name}: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/delete/<sheet_name>/<int:row_id>', methods=['DELETE'])
def delete_record(sheet_name, row_id):
    """Delete a record from the specified sheet"""
    try:
        data = {'row': row_id}
        result = sheets_service.delete_data(sheet_name, data)
        return jsonify({'success': True, 'message': result})
    except Exception as e:
        app.logger.error(f"Error deleting record from {sheet_name}: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
