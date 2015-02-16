import java.nio.file.Paths;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class Solution {

	public static ArrayDeque<byte[][]> loadPuzzles(String file) {
		try (Scanner s = new Scanner(Paths.get(file))) {
			byte[][] puzzle = null;
			String line = null;
			ArrayDeque<byte[][]> qOfPuzzles = new ArrayDeque<byte[][]>(100);
			int rowIndex, columnIndex;
			while (s.hasNextLine()) {
				line = s.nextLine();
				if (line.startsWith("Grid")) {
					qOfPuzzles.add(puzzle = new byte[9][9]);
				} else {
					// error : data format error.
				}
				for (rowIndex = 0; rowIndex < 9; ++rowIndex) {
					line = s.nextLine();
					for (columnIndex = 0; columnIndex < 9; ++columnIndex) {
						puzzle[rowIndex][columnIndex] = (byte) (line
								.charAt(columnIndex) - 48);
					}
				}
			}
			return qOfPuzzles;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static void main(String[] args) {
		ArrayDeque<byte[][]> puzzles = loadPuzzles("p096_sudoku.txt");
		int i, j;
		int sum = 0;
		for (byte[][] eachPuzzle : puzzles) {
			solvePuzzle(eachPuzzle);
			sum += (eachPuzzle[0][0] * 100 + eachPuzzle[0][1] * 10 + eachPuzzle[0][2]);
			StringBuilder builder = new StringBuilder(110);
			for (i = 0; i < 9; ++i) {
				for (j = 0; j < 9; ++j) {
					builder.append(eachPuzzle[i][j] + " ");
				}
				builder.append("\n");
			}
			System.out.println(builder.toString() + "=================");
		}
		System.out.println("Sum = " + sum);
	}

	public static void solvePuzzle(byte[][] puzzle) {
		assignCellANumber(puzzle, 0, 0);
	}

	public static boolean assignCellANumber(final byte[][] puzzle,
			final int row, final int col) {
		if (row == 9)
			return true;
		else if (puzzle[row][col] == 0) {
			List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9);
			Collections.shuffle(list);
			for (Integer integer : list) {
				if (isNumAllowed(puzzle, row, col, integer)) {
					puzzle[row][col] = integer.byteValue();
					if (assignCellANumber(puzzle, (col == 8 ? row + 1 : row),
							(col + 1) % 9)) {
						return true;
					} else {
						puzzle[row][col] = 0;
					}
				}
			}
			return false;
		}
		return assignCellANumber(puzzle, (col == 8 ? row + 1 : row),
				(col + 1) % 9);
	}

	public static boolean isNumAllowed(final byte[][] puzzle, final int row,
			final int col, final int num) {
		int i, j;
		for (i = 0; i < 9; ++i) {
			if (puzzle[i][col] == num)
				return false;
		}
		for (j = 0; j < 9; ++j) {
			if (puzzle[row][j] == num)
				return false;
		}
		i = (row / 3) * 3;
		j = (col / 3) * 3;
		if (puzzle[i][j] == num || puzzle[i][j + 1] == num
				|| puzzle[i][j + 2] == num)
			return false;
		i++;
		if (puzzle[i][j] == num || puzzle[i][j + 1] == num
				|| puzzle[i][j + 2] == num)
			return false;

		i++;
		if (puzzle[i][j] == num || puzzle[i][j + 1] == num
				|| puzzle[i][j + 2] == num)
			return false;

		return true;
	}
}
