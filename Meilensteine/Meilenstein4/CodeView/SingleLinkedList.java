public class SingleLinkedList {
	private Node front;

	// Constructor
	public SingleLinkedList() {
		front = null;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public boolean addDataAtPosition(int position, String data) {
		if (position < 0 || position > getSize()) {
			System.err.println(
					"Exeption in thread \"main\" java.lang.ListIndexOutOfBounceExeption: position is out of list");
			return false;
		}
		Node newNode = new Node(data);
		if (position == 0) {
			newNode.setNext(front);
			front = newNode;
			return true;
		}
		Node currentNode = front;
		for (int currentIndex = 1; currentIndex < position; currentIndex++) {
			currentNode = currentNode.getNext();
		}
		newNode.setNext(currentNode.getNext());
		currentNode.setNext(newNode);
		return true;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public String getDataAtPosition(int position) {
		if (position < 0 || position >= getSize()) {
			System.err.println(
					"Exeption in thread \"main\" java.lang.ListIndexOutOfBounceExeption: position is out of list");
			return null;
		}
		Node currentNode = front;
		for (int currentIndex = 0; currentIndex < position; currentIndex++) {
			currentNode = currentNode.getNext();
		}
		return currentNode.getData();
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public int getPositionOfData(String data) {
		if (front == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: list is empty");
			return -1;
		}
		Node currentNode = front;
		for (int position = 0; position < getSize(); position++) {
			if (currentNode.getData().equals(data)) {
				return position;
			}
			currentNode = currentNode.getNext();
		}
		System.err.println("Exeption in thread \"main\" java.lang.IOExeption: data not in list");
		return -1;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public boolean removeDataAtPosition(int position) {
		if (position < 0 || position >= getSize()) {
			System.err.println(
					"Exeption in thread \"main\" java.lang.ListIndexOutOfBounceExeption: position is out of list");
			return false;
		}
		if (position == 0) {
			front = front.getNext();
			return true;
		}
		Node currentNode = front;
		for (int currentIndex = 1; currentIndex < position; currentIndex++) {
			currentNode = currentNode.getNext();
		}
		currentNode.setNext(currentNode.getNext().getNext());
		return true;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public boolean invertList() {
		if (front == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: list is empty");
			return false;
		}
		Node newFront = front;
		int size = getSize() - 1;
		for (int i = 0; i < size; i++) {
			newFront = newFront.getNext();
		}
		Node currentNode;
		for (int j = 0; j < size; j++) {
			currentNode = front;
			for (int k = 0; k < size - 1 - j; k++) {
				currentNode = currentNode.getNext();
			}
			currentNode.getNext().setNext(currentNode);
		}
		front.setNext(null);
		front = newFront;
		return true;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public void deleteList() {
		this.front = null;
	}

	// Methode ist schon von Bedeutung und k�nnte man mal anzeigen
	public int getSize() {
		int size = 0;
		Node currentNode = front;
		while (currentNode != null) {
			currentNode = currentNode.getNext();
			size++;
		}
		return size;
	}

	// Derzeit nur f�r Debuggen
	public void print() {
		int position = 0;
		Node currentNode = front;
		while (currentNode != null) {
			System.out.println("Data at position " + position + ": " + currentNode.getData());
			currentNode = currentNode.getNext();
			position++;
		}
	}
}