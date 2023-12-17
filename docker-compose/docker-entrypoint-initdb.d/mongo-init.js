db = db.getSiblingDB('EcoSonar');

db.createUser({ user: 'ecosonar', pwd: 'ecosonar', roles: [{role: 'readWrite', db: 'EcoSonar'}] })