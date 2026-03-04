import sys
import json
import numpy as np
from sklearn.linear_model import LinearRegression

data = json.loads(sys.argv[1])

if len(data) < 2:
    print(json.dumps({"prediction": None}))
    sys.exit()

X = np.array(range(len(data))).reshape(-1, 1)
y = np.array(data)

model = LinearRegression()
model.fit(X, y)

next_month = np.array([[len(data)]])
prediction = model.predict(next_month)

print(json.dumps({"prediction": int(prediction[0])}))