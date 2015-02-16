package dp;

import java.util.Hashtable;
import java.util.Map;

public class FacebookLoginHandler extends AbstractLoginHandler {

	private final static Hashtable<String, String> database;

	static {
		database = loadDatabase();
	}

	public FacebookLoginHandler() {
		super();
	}

	private static Hashtable<String, String> loadDatabase() {
		return new Hashtable<String, String>();
	}

	@Override
	protected Map<String, String> getDatabase() {
		return database;
	}

}
