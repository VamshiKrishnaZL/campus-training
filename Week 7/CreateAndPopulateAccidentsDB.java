import java.io.File;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Scanner;

import au.com.bytecode.opencsv.CSVReader;

public class CreateAndPopulateAccidentsDB {

	public static String readFile(String fileName) {
		StringBuilder builder = new StringBuilder(500);
		try (Scanner s = new Scanner(new File(fileName))) {
			while (s.hasNextLine()) {
				builder.append(s.nextLine());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return builder.toString();
	}

	public static void main(String[] args) throws Exception {

		Class.forName("com.mysql.jdbc.Driver");
		final String connectionURL = "jdbc:mysql://localhost:3306/exercises";

		Connection connection = DriverManager.getConnection(connectionURL,
				"vamshi", "nopassword");

		connection.setAutoCommit(false);

		Statement statement = connection.createStatement();

		statement.execute("DROP DATABASE IF EXISTS exercises");

		statement.execute("CREATE DATABASE exercises");

		connection.setCatalog("exercises");

		String sql = readFile("CreateAccidentsTable.sql");

		statement.execute(sql);

		PreparedStatement preparedStatement = connection
				.prepareStatement("INSERT INTO Accidents(Id,State,Year,Total,Killed,Injured,Fatal) VALUES (?,?,?,?,?,?,?)");

		CSVReader reader = new CSVReader(new FileReader("Data.csv"));
		String[] completeStateRecord;
		final String[] headers = reader.readNext();
		String eachHeader = null;
		int eachHeaderLength;
		byte[] columnType = new byte[headers.length];
		final int[] columnYear = new int[headers.length];
		for (int i = 1; i < columnYear.length; i++) {
			eachHeader = headers[i].trim();
			eachHeaderLength = eachHeader.length();
			columnYear[i] = Integer.parseInt(eachHeader.substring(
					eachHeaderLength - 4, eachHeaderLength));			
			if (eachHeader.contains("Total")) {
				columnType[i] = 0; // Total
			} else if (eachHeader.contains("Killed")) {
				columnType[i] = 1; // Fatal
			} else if (eachHeader.contains("Injured")) {
				columnType[i] = 2; // Killed
			} else if (eachHeader.contains("Fatal")) {
				columnType[i] = 3; // Injured
			}
		}
		int baseYear = 2006;
		int[][] stateRecord = new int[4][7];
		String state = null;
		String yearAndTypeCount = null;
		int i, j, len, count;
		int[] countsPerYear = null;
		int generatedId = 1;
		while ((completeStateRecord = reader.readNext()) != null) {
			state = completeStateRecord[0];
			for (i = 1, len = completeStateRecord.length; i < len; ++i) {
				yearAndTypeCount = completeStateRecord[i];
				count = 0;
				for (j = 0; j < yearAndTypeCount.length(); ++j) {
					if (Character.isDigit(yearAndTypeCount.charAt(j))) {
						count = count * 10 + (yearAndTypeCount.charAt(j) - 48);
					} else {
						count = 0;
						break;
					}
				}
				stateRecord[columnType[i]][columnYear[i] - 2006] = count;
			}

			for (i = 2006; i <= 2012; ++i) {
				preparedStatement.setInt(1, generatedId);
				preparedStatement.setString(2, state);
				preparedStatement.setInt(3, i);// year
				preparedStatement.setInt(4, stateRecord[0][i - 2006]);
				preparedStatement.setInt(5, stateRecord[1][i - 2006]);
				preparedStatement.setInt(6, stateRecord[2][i - 2006]);
				preparedStatement.setInt(7, stateRecord[3][i - 2006]);

				++generatedId;
				preparedStatement.addBatch();
			}
		}

		preparedStatement.executeBatch();
		connection.commit();
		connection.close();

	}
}
