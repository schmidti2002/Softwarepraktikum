
public class Main {
	public static void main(String[] args) {
		SingleLinkedList<Integer> Albert = new SingleLinkedList<Integer>();
		Integer data = 1;
		for (int i = 0; i < 10; i++) {
			Albert.addDataAtPosition(i, 10 * i);
		}
		Albert.print();
		System.out.println(Albert.getDataAtPositon(2).getDataValue());
		System.out.println(Albert.getSize());
		System.out.println(Albert.getPositionWithData(0));
		System.out.println(Albert.getPositionWithData(90));
		System.out.println(Albert.getPositionWithData(100));
		Albert.deleteDataAtPosition(9);
		Albert.deleteDataAtPosition(5);
		Albert.deleteDataAtPosition(0);
		Albert.print();
		System.out.println();
		Albert.invert();
		Albert.print();
	}
}