class SerializeMixin:
    def serialize(self):
        serialized = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            # Convert Date/Datetime to string
            if hasattr(value, 'isoformat'):
                serialized[column.name] = value.isoformat()
            else:
                serialized[column.name] = value
        return serialized
