# -*- coding: utf-8 -*-

import os
#os.system('python3 -m pip install tensorflow')
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import numpy as np
import sys
'''
json_file = open('model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
model = tf.keras.models.model_from_json(loaded_model_json)
# load weights into new model
model.load_weights("model.h5")
'''

def main():
	os.system('python3 -m pip install tensorflow')

	if (len(sys.argv) < 2):
		print("Input text is missing")

	else:
		input_text = sys.argv[1]

		model = load_model('/Models/lstm')

		tokenizer = Tokenizer(num_words = 5000)

		sentiment = ['Neutral','Negative','Positive']

		sequence = tokenizer.texts_to_sequences([input_text])
		test = pad_sequences(sequence, maxlen = 200)
		print(sentiment[np.around(model.predict(test), decimals = 0).argmax(axis = 1)[0]])


if __name__ == "__main__":
    main()