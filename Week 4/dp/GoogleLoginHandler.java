package dp;

import java.util.Hashtable;
import java.util.Map;

public class GoogleLoginHandler extends AbstractLoginHandler {

	private final static Map<String, String> database;

	static {
		database = loadDatabase();
	}

	private static Hashtable<String, String> loadDatabase() {
		Hashtable<String, String> hashtable = new Hashtable<String, String>();
		hashtable.put("abcdef@gmail.com", "123456");
		return hashtable;
	}

	public GoogleLoginHandler() {
		super();
	}

	@Override
	protected Map<String, String> getDatabase() {
		return database;
	}

}
