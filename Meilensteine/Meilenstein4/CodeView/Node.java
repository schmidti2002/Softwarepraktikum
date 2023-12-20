public class Node {
	// Vielleicht sollte die M�glichkeit bestehen,
	// sich diese Klasse irgendwo anzeigen zu lassen

	private String data;
	private Node next;

	public Node(String data) {
		this.data = data;
		this.next = null;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public Node getNext() {
		return next;
	}

	public void setNext(Node next) {
		this.next = next;
	}
}