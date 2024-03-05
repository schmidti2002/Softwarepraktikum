public class Main {
	public static void main(String[] args) {
//		SingleLinkedList Albert = new SingleLinkedList();
//		System.out.println(Albert.getDataAtPosition(5));
//		Integer data = 1;
//		for (int i = 0; i < 10; i++) {
//			Albert.addDataAtPosition(i, Integer.toString(10 * i));
//		}
//		Albert.print();
//		System.out.println(Albert.getDataAtPosition(2));
//		System.out.println(Albert.getSize());
//		System.out.println(Albert.getPositionOfData(Integer.toString(0)));
//		System.out.println(Albert.getPositionOfData(Integer.toString(90)));
//		System.out.println(Albert.getPositionOfData(Integer.toString(100)));
//		Albert.removeDataAtPosition(9);
//		Albert.removeDataAtPosition(5);
//		Albert.removeDataAtPosition(0);
//		Albert.print();
//		System.out.println();
//		Albert.invert();
//		Albert.print();

//		int[] arr = { 9, 0, 5, 8, 6, 7, 2, 4, 3, 1 };
//		System.out.println(Arrays.toString(arr));
//		System.out.println(Arrays.toString(SortierAlgos.mergeSort(arr)));		

		directedUnweightedGraph neu = new directedUnweightedGraph();
		neu.insertNode("A");
		neu.insertNode("B");
		neu.insertNode("C");
		neu.insertNode("D");
		neu.print();
		System.out.println();
		neu.insertEdge("A", "D");
		neu.insertEdge("B", "C");
		neu.insertEdge("C", "D");
		neu.insertEdge("D", "B");
		neu.insertEdge("A", "A");
		neu.print();
		neu.invert();
		System.out.println();
		neu.print();
		System.out.println();
		neu.removeEdge("E", "B");
		neu.print();
	}
}