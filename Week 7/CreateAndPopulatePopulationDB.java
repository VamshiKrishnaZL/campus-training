import java.io.File;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import au.com.bytecode.opencsv.CSVReader;

public class CreateAndPopulatePopulationDB {

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

		Pattern YEAR_REGEX = Pattern.compile(".+([12]\\d{3}).+");

		Class.forName("com.mysql.jdbc.Driver");
		final String connectionURL = "jdbc:mysql://localhost:3306/exercises";

		Connection connection = DriverManager.getConnection(connectionURL,
				"vamshi", "nopassword");

		connection.setAutoCommit(false);

		Statement statement = connection.createStatement();

		// statement.execute("DROP DATABASE IF EXISTS exercises");

		statement.execute("CREATE DATABASE IF NOT EXISTS exercises");

		statement.execute("DROP TABLE IF EXISTS Population");

		connection.setCatalog("exercises");

		String sql = readFile("CreatePopulationTable.sql");

		statement.execute(sql);

		PreparedStatement preparedStatement = connection
				.prepareStatement(
						"INSERT INTO Population(Id,StateRank,State,Year,Total) VALUES (?,?,?,?,?)",
						Statement.RETURN_GENERATED_KEYS);

		CSVReader reader = new CSVReader(new FileReader(
				"India Population Census.csv"));
		String[] completeStateRecord;
		final String[] headers = reader.readNext();
		String eachHeader = null;
		final int[] columnYear = new int[headers.length];
		for (int i = 2; i < columnYear.length; i++) {
			eachHeader = headers[i].trim();
			Matcher matcher = YEAR_REGEX.matcher(eachHeader);
			if (matcher.find()) {
				eachHeader = matcher.group(1);
				columnYear[i] = Integer.parseInt(eachHeader);
			}
		}

		int[] stateRecord = new int[7];
		String state = null, rank = null;
		String populationCount = null;
		int i, j, len, count;

		int generatedId = 1;
		while ((completeStateRecord = reader.readNext()) != null) {
			rank = completeStateRecord[0];
			state = completeStateRecord[1];
			for (i = 2, len = completeStateRecord.length; i < len; ++i) {
				populationCount = completeStateRecord[i];
				count = 0;
				for (j = 0; j < populationCount.length(); ++j) {
					if (Character.isDigit(populationCount.charAt(j))) {
						count = count * 10 + (populationCount.charAt(j) - 48);
					} else if (populationCount.charAt(j) == ',') {
						continue;
					} else {						
						count = 0;
						break;
					}
				}
				stateRecord[(columnYear[i] - 1951) / 10] = count;
			}

			for (i = 1951; i <= 2011; i += 10) {
				preparedStatement.setInt(1, generatedId);
				preparedStatement.setString(2, rank);
				preparedStatement.setString(3, state);
				preparedStatement.setInt(5, stateRecord[(i - 1951) / 10]);
				preparedStatement.setInt(4, columnYear[(i - 1951) / 10 + 2]);// year
				++generatedId;
				preparedStatement.addBatch();
			}
		}
		reader.close();
		preparedStatement.executeBatch();
		connection.commit();
		connection.close();

	}
}
