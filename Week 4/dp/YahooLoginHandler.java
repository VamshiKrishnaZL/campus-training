package dp;

import java.util.Hashtable;
import java.util.Map;

public class YahooLoginHandler extends AbstractLoginHandler {

	private final static Hashtable<String, String> database;

	static {
		database = loadDatabase();
	}

	private static Hashtable<String, String> loadDatabase() {
		return new Hashtable<String, String>();
	}

	public YahooLoginHandler() {
		super();
	}

	@Override
	protected Map<String, String> getDatabase() {
		return database;
	}

}
