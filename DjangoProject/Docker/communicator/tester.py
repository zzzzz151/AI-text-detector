import time
import pandas as pd

from lm_submission import LanguageModel

number_of_rows = 100

def load_dataset(dataset_name:str):
	print("Loading dataset...")
	pf = pd.read_table(dataset_name)
	print(f"Dataset {dataset_name} loaded.")
	return pf

def get_random_rows(dataset_name:str):
	# This uses the static hardcoded variable above
	return load_dataset(dataset_name).sample(number_of_rows).values

class TestLanguageModel:
	def __init__(self, model_class):
		print("Loading model...")
		self.model = model_class()
		print(f"Model {model_class.__name__} loaded.")

	def predict(self, text:str):
		result = self.model.predict(text)
		if type(result) == list:
			result = result[0]
		return round(result * 100)

	def test_model(self, dataset_name):
		dataset = get_random_rows(dataset_name)
		results = []  # (probability, is_synthetic, length_in_chars, time) aka (84, 1, 283, 0.056)

		dataset_evaluation_time_started = time.time()
		for data_id, string, is_synthetic in dataset:
			datapoint_evaluation_time_started = time.time()
			probability = round(self.predict(str(string)))
			results.append(
				(data_id, probability, is_synthetic, len(string), time.time() - datapoint_evaluation_time_started))
			print(f"{len(results)}/{dataset.shape[0]}")
		dataset_evaluation_time_taken = round(time.time() - dataset_evaluation_time_started, 1)

		probability_when_human = [probability for _, probability, is_synthetic, _, _ in results if
		                          is_synthetic == "human"]
		average_when_human = round(sum(probability_when_human) / len(probability_when_human), 1)

		probability_when_AI = [probability for _, probability, is_synthetic, _, _ in results if
		                       is_synthetic == "generated"]
		average_when_AI = round(sum(probability_when_AI) / len(probability_when_AI), 1)

		print(f"When human, detected as average {average_when_human}%")
		print(f"When AI, detected as average {average_when_AI}%")
		print(f"Took {dataset_evaluation_time_taken} seconds.")

		return average_when_human, average_when_AI, dataset_evaluation_time_taken

	def rewrite_test_file(self, old_dataset_name, new_dataset_name):
		dataset = load_dataset(old_dataset_name)
		try:
			open(new_dataset_name, 'x').close()
		except:
			...

		new_dataset = open(new_dataset_name, 'w')
		old_dataset = open(old_dataset_name, 'r')
		new_dataset.write(old_dataset.readline())
		old_dataset.close()
		new_dataset.close()

		new_dataset = open(new_dataset_name, 'a', encoding='utf-8')
		i = 0
		for data_id, string, is_synthetic in dataset:
			try:
				round(self.predict(str(string)))
			except:
				print(f"Failed for {data_id}\n{string}")
				continue
			i += 1
			print(i)
			new_dataset.write(str(data_id) + '\t' + str(string) + '\t' + str(is_synthetic) + '\n')

		new_dataset.close()

def test_given_model(model, dataset_name:str):
	dataset = get_random_rows(dataset_name)
	results = []  # (probability, is_synthetic, length_in_chars, time) aka (84, 1, 283, 0.056)

	dataset_evaluation_time_started = time.time()
	for data_id, string, is_synthetic in dataset:
		datapoint_evaluation_time_started = time.time()
		probability = round(model.predict(str(string)))
		results.append(
			(data_id, probability, is_synthetic, len(string), time.time() - datapoint_evaluation_time_started))
		print(f"{len(results)}/{dataset.shape[0]}")
	dataset_evaluation_time_taken = round(time.time() - dataset_evaluation_time_started, 1)

	probability_when_human = [probability for _, probability, is_synthetic, _, _ in results if
	                          is_synthetic == "human"]
	average_when_human = round(sum(probability_when_human) / len(probability_when_human), 1)

	probability_when_AI = [probability for _, probability, is_synthetic, _, _ in results if
	                       is_synthetic == "generated"]
	average_when_AI = round(sum(probability_when_AI) / len(probability_when_AI), 1)

	print(f"When human, detected as average {average_when_human}%")
	print(f"When AI, detected as average {average_when_AI}%")
	print(f"Took {dataset_evaluation_time_taken} seconds.")

	return average_when_human, average_when_AI, dataset_evaluation_time_taken

if __name__ == '__main__':
	test_model = TestLanguageModel(LanguageModel)
	avg_human, avg_ai, time_taken = test_model.test_model("train.tsv")
