import java.util.Arrays;

public class SortierAlgos {

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public static int[] bubbleSort(int[] arr) {
		int temp;
		for (int i = 0; i < arr.length - 1; i++) {
			for (int k = 0; k < arr.length - 1 - i; k++) {
				if (arr[k] > arr[k + 1]) {
					temp = arr[k];
					arr[k] = arr[k + 1];
					arr[k + 1] = temp;
				}
			}
		}
		return arr;
	}

	// Methode ist Button zugeschrieben und muss angezeigt werden
	public static int[] mergeSort(int[] arr) {
		if (arr.length <= 1) {
			return arr;
		} else {
			int middle = arr.length / 2;

			int[] left = new int[middle];
			for (int i = 0; i < middle; i++) {
				left[i] = arr[i];
			}
			System.out.println(Arrays.toString(left));
			int[] right = new int[arr.length - middle];
			for (int j = middle; j < arr.length; j++) {
				right[j - middle] = arr[j];
			}
			System.out.println(Arrays.toString(right));
			left = mergeSort(left);
			right = mergeSort(right);
			return merge(left, right);
		}
	}

	// Methode ist von Bedeutung und muss angezeigt werden
	private static int[] merge(int[] left, int[] right) {
		int[] sortedArr = new int[left.length + right.length];
		int indexLeft = 0, indexRight = 0, indexSorted = 0;

		while (indexLeft < left.length && indexRight < right.length) {
			if (left[indexLeft] < right[indexRight]) {
				sortedArr[indexSorted] = left[indexLeft];
				indexLeft++;
			} else {
				sortedArr[indexSorted] = right[indexRight];
				indexRight++;
			}
			indexSorted++;
		}
		while (indexLeft < left.length) {
			sortedArr[indexSorted] = left[indexLeft];
			indexLeft++;
			indexSorted++;
		}
		while (indexRight < right.length) {
			sortedArr[indexSorted] = right[indexRight];
			indexRight++;
			indexSorted++;
		}
		return sortedArr;
	}
}