public class Node<T> {
	private T data;
	private Node<T> next;

	public Node(T data) {
		this.data = data;
		this.next = null;
	}

	public void setDataValue(T data) {
		this.data = data;
	}

	public T getDataValue() {
		return data;
	}

	public void setNext(Node<T> next) {
		this.next = next;
	}

	public Node<T> getNext() {
		return next;
	}
}