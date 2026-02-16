try:
    import database
    print("Imported database successfully")
    print(f"URL: {database.SQLALCHEMY_DATABASE_URL}")
except Exception as e:
    print(f"Failed to import: {e}")
