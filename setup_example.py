#!/usr/bin/env python3

"""
Script to insert the example network into the database.
Run this script to populate the database with the example network.
"""

import json
from database import SessionLocal, Base, engine
from models import Network

def insert_example_network():
    # Create database session
    db = SessionLocal()
    
    try:
        # Read example network
        with open('example_network.json', 'r') as f:
            network_data = json.load(f)
        
        # Create network record
        network = Network(
            name=network_data["name"],
            description="Example gas network with various components",
            data=json.dumps(network_data)
        )
        
        # Add to database
        db.add(network)
        db.commit()
        db.refresh(network)
        
        print(f"Example network inserted with ID: {network.id}")
        
    except Exception as e:
        print(f"Error inserting example network: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Insert example network
    insert_example_network()