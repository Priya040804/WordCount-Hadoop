**📝 Distributed Word Count — MapReduce Visualizer (PySpark + React)**

This project implements the Word Count MapReduce workflow using PySpark and provides an interactive React-based visualizer to demonstrate how data flows through Mapper and Reducer stages.

The backend Python script performs the Distributed Word Count using PySpark-style transformations, parallel processing, and reducer aggregation.
The frontend React application visualizes this entire process — splitting the text, mapping, shuffling, reducing, and finally displaying the Top 15 most frequent words.

**📌 Features**

✔️ Distributed Word Count implemented using PySpark concepts

✔️ 4 Mapper Nodes process text in parallel

✔️ 2 Reducer Nodes aggregate intermediate results

✔️ React UI visualizes Map → Shuffle → Reduce

✔️ Shows Top 15 most frequent words

✔️ Uses TailwindCSS for styling

**📁 Project Structure**

APP-PROJECT/

│── public/

│── src/

│   ├── components/

│   │    └── MapReduceVisualizer.js

│   ├── App.js

│   ├── App.css

│   ├── index.js

│   ├── index.css

│   ├── reportWebVitals.js

│   └── setupTests.js

│── python/

│   └── distributed_wordcount.py

│── package.json

│── package-lock.json

│── tailwind.config.js

│── postcss.config.js

│── README.md

**🧠 How the PySpark-Style MapReduce Works**
1️⃣ Split Phase
The PySpark-based Python script splits the input text into 4 equal chunks:
chunks = self.split_text(text, self.num_nodes)
Each chunk is sent to a mapper node.


**2️⃣ MAP Phase (4 Mapper Nodes)**
Each mapper:
Lowercases text
Splits into words
Emits (word, 1) pairs
Uses Counter() for local counting

Python function:
def map_worker(node_id, text_chunk, results_queue):
    words = text_chunk.lower().split()
    word_count = Counter(words)
    results_queue.put((node_id, dict(word_count)))

This parallels PySpark’s:
rdd.flatMap().map(lambda word: (word, 1))


**3️⃣ Shuffle & Sort Phase**
All mapper outputs are grouped by word key.
(This mirrors PySpark’s internal shuffle stage during reduceByKey.)


**4️⃣ REDUCE Phase (2 Reducer Nodes)
**
Reducers merge intermediate frequencies:

def reduce_worker(node_id, partial_results, results_queue):
    combined = Counter()
    for result in partial_results:
        combined.update(result)
    results_queue.put((node_id, dict(combined)))

Equivalent PySpark logic:
rdd.reduceByKey(lambda a, b: a + b)


**5️⃣ Final Aggregation**
All reducer outputs are combined into a final global word count.
display_results() prints Top 15 words sorted by frequency.



**🐍 Running the PySpark-Based Word Count**
Navigate to the Python folder:
cd python
python distributed_wordcount.py
The script outputs:
Mapper logs
Reducer logs
Total unique word count
Top 15 frequent words


**⚛️ Running the React Visualization**
Install dependencies:
npm install

Start the app:
npm start


**The React UI shows:**
Mapper output from 4 nodes
Shuffle grouping
Reducer aggregation
Final Top-15 visualization


**📦 Tech Stack**
Backend
PySpark-style Distributed Word Count
Python
multiprocessing
Counter collections
Frontend
React
TailwindCSS
Lucide React Icons


**🛠 Future Enhancements**
Integrate real PySpark cluster execution
Display animated data flow
Add stop-word filtering

Add stemming/lemmatization options

🤝 Contributing

Pull requests and suggestions are welcome!
