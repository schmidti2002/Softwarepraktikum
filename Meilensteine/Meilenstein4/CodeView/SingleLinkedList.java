public class SingleLinkedList<T> {
	private Node<T> front;

	// Constructor
	public SingleLinkedList() {
		front = null;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public void addDataAtPosition(int position, T data) {
		if ((position < 0) || (position > getSize())) {
			System.out.println("User Error: Position out of List");
			return;
		}
		Node<T> newNode = new Node<>(data);
		if (position == 0) {
			newNode.setNext(front);
			front = newNode;
			return;
		}
		Node<T> currentNode = front;
		for (int currentIndex = 1; currentIndex < position; currentIndex++) {
			currentNode = currentNode.getNext();
		}
		newNode.setNext(currentNode.getNext());
		currentNode.setNext(newNode);
		return;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public Node<T> getDataAtPositon(int position) {
		if ((position < 0) || (position >= getSize())) {
			System.out.println("User Error: Position out of List");
			return null;
		}
		Node<T> currentNode = front;
		for (int i = 0; i < position; i++) {
			currentNode = currentNode.getNext();
		}
		return currentNode;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public int getPositionWithData(T data) {
		Node<T> currentNode = front;
		for (int position = 0; position < getSize(); position++) {
			if (currentNode.getDataValue().equals(data)) {
				return position;
			}
			currentNode = currentNode.getNext();
		}
		return -1;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public void deleteDataAtPosition(int position) {
		if ((position < 0) || (position >= getSize())) {
			System.out.println("User Error: Position out of List");
			return;
		}
		if (position == 0) {
			front = front.getNext();
			return;
		}
		Node<T> currentNode = front;
		for (int currentIndex = 1; currentIndex < position; currentIndex++) {
			currentNode = currentNode.getNext();
		}
		currentNode.setNext(currentNode.getNext().getNext());
		return;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public void invert() {
		Node<T> newFront = front;
		int size = getSize();
		for (int i = 0; i < size - 1; i++) {
			newFront = newFront.getNext();
		}
		Node<T> currentNode;
		for (int j = 0; j < size - 1; j++) {
			currentNode = front;
			for (int k = 0; k < size - 2 - j; k++) {
				currentNode = currentNode.getNext();
			}
			currentNode.getNext().setNext(currentNode);
		}
		front.setNext(null);
		front = newFront;
	}

	// Methode ist schon von Bedeutung und könnte man mal anzeigen
	public int getSize() {
		int size = 0;
		Node<T> currentNode = front;
		while (currentNode != null) {
			currentNode = currentNode.getNext();
			size++;
		}
		return size;
	}

	// Derzeit nur für Debuggen
	public void print() {
		int position = 0;
		Node<T> currentNode = front;
		while (currentNode != null) {
			System.out.println("Data at Positon " + position + ": " + currentNode.getDataValue());
			currentNode = currentNode.getNext();
			position++;
		}
	}
}