import java.io.File;
import java.util.ArrayDeque;
import java.util.Scanner;

public class Solution {

	public static void main(String[] args) {

		try {
			doSolve();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private static void doSolve() {
		try (Scanner s = new Scanner(new File("Data2.txt"))) {
			Scanner lineScanner = null;
			ArrayDeque<int[]> stack = new ArrayDeque<int[]>(120);
			@SuppressWarnings("unused")
			String line = null;
			int[] array;
			int iteration = 1, i;
			while (s.hasNextLine()) {
				array = new int[iteration];
				lineScanner = new Scanner(line = s.nextLine());
				stack.push(array);
				for (i = 0; i < iteration; ++i) {
					if (lineScanner.hasNextInt())
						array[i] = lineScanner.nextInt();
					else {
						System.err.println("Error");
					}
				}

				iteration++;
			}
			int[] maxSolutionList = null;
			int[] toBeSolved;
			int n1, n2;
			while (true) {
				maxSolutionList = stack.pop();
				if (stack.isEmpty())
					break;
				toBeSolved = stack.peek();
				for (i = 0; i < toBeSolved.length; ++i) {
					n1 = toBeSolved[i] + maxSolutionList[i];
					n2 = toBeSolved[i] + maxSolutionList[i + 1];
					toBeSolved[i] = n1 > n2 ? n1 : n2;
				}
			}
			System.out.println(maxSolutionList[0]);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
