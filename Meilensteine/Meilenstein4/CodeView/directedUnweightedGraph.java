import java.util.LinkedList;

public class directedUnweightedGraph {
	private LinkedList<LinkedList<Node>> adjList;

	public directedUnweightedGraph() {
		adjList = null;

	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public boolean insertNode(String data) {
		if (adjList == null) {
			adjList = new LinkedList<>();
			adjList.add(new LinkedList<>());
			adjList.get(0).add(new Node(data));
			return true;
		}
		for (int i = 0; i < adjList.size(); i++) {
			if (adjList.get(i).get(0).getData().equals(data)) {
				System.err.println("Exeption in thread \"main\" java.lang.IOExeption: node already in graph");
				return false;
			}
		}
		adjList.add(adjList.size(), new LinkedList<>());
		adjList.get(adjList.size() - 1).add(new Node(data));
		return true;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public boolean insertEdge(String nodeOne, String nodeTwo) {
		if (adjList == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: graph is empty");
			return false;
		}
		int indexNodeOne = -1, indexNodeTwo = -1;
		for (int i = 0; i < adjList.size(); i++) {
			if (adjList.get(i).get(0).getData().equals(nodeOne)) {
				indexNodeOne = i;
			}
			if (adjList.get(i).get(0).getData().equals(nodeTwo)) {
				indexNodeTwo = i;
			}
		}
		for (int i = 1; i < adjList.get(indexNodeOne).size(); i++) {
			if (adjList.get(indexNodeOne).get(i).getData().equals(nodeTwo)) {
				indexNodeTwo = -2;
			}
		}
		if (indexNodeOne == -1 || indexNodeTwo == -1) {
			System.err.println("Exeption in thread \"main\" java.lang.IOExeption: node not in graph");
			return false;
		}
		if (indexNodeTwo == -2) {
			System.err.println("Exeption in thread \"main\" java.lang.IOExeption: edge already in graph");
			return false;
		}
		adjList.get(indexNodeOne).add(adjList.get(indexNodeTwo).get(0));
		return true;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public LinkedList<Node> getNode(String data) { // vielleicht getEdgesOfNode
		if (adjList == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: graph is empty");
			return null;
		}
		for (int i = 0; i < adjList.size(); i++) {
			if (adjList.get(i).get(0).getData().equals(data)) {
				return adjList.get(i);
			}
		}
		System.err.println("Exeption in thread \"main\" java.lang.IOExeption: node not in graph");
		return null;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public boolean removeEdge(String nodeOne, String nodeTwo) {
		if (adjList == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: graph is empty");
			return false;
		}
		for (int i = 0; i < adjList.size(); i++) {
			if (adjList.get(i).get(0).getData().equals(nodeOne)) {
				for (int k = 0; k < adjList.get(i).size(); k++) {
					if (adjList.get(i).get(k).getData().equals(nodeTwo)) {
						adjList.get(i).remove(k);
						return true;
					}
				}
				System.err.println("Exeption in thread \"main\" java.lang.IOExeption: edge not in graph");
				return false;
			}
		}
		System.err.println("Exeption in thread \"main\" java.lang.IOExeption: node not in graph");
		return false;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public boolean removeNode(String data) {
		if (adjList == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: graph is empty");
			return false;
		}
		for (int i = 0; i < adjList.size(); i++) {
			for (int k = 1; k < adjList.get(i).size(); k++) {
				if (adjList.get(i).get(k).getData().equals(data)) {
					adjList.get(i).remove(k);
				}
			}
		}
		for (int i = 0; i < adjList.size(); i++) {
			if (adjList.get(i).get(0).getData().equals(data)) {
				adjList.remove(i);
				return true;
			}
		}
		System.err.println("Exeption in thread \"main\" java.lang.IOExeption: node not in graph");
		return false;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public boolean invert() {
		if (adjList == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: graph is empty");
			return false;
		}
		LinkedList<LinkedList<Node>> newAdjList = new LinkedList<>();
		for (int i = 0; i < adjList.size(); i++) {
			newAdjList.add(new LinkedList<>());
			newAdjList.get(i).add(new Node(adjList.get(i).get(0).getData()));
		}
		for (int i = 0; i < adjList.size(); i++) {
			for (int k = 1; k < adjList.get(i).size(); k++) {
				for (int p = 0; p < newAdjList.size(); p++) {
					if (adjList.get(p).get(0).getData().equals(adjList.get(i).get(k).getData())) {
						newAdjList.get(p).add(new Node(adjList.get(i).get(0).getData()));
					}
				}
			}
		}
		this.deleteGraph();
		adjList = newAdjList;
		return true;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public void deleteGraph() {
		for (int i = 0; i < adjList.size(); i++) {
			adjList.get(i).clear();
		}
		adjList.clear();
	}

	// Derzeit nur für Debuggen
	public void print() {
		if (adjList == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: graph is empty");
			return;
		}
		for (int i = 0; i < adjList.size(); i++) {
			System.out.print(adjList.get(i).get(0).getData() + " -> ");
			for (int k = 1; k < adjList.get(i).size(); k++) {
				System.out.print(adjList.get(i).get(k).getData() + ", ");
			}
			System.out.println();
		}
	}
}
