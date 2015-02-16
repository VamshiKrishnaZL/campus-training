package dp;

import java.util.Map;
import java.util.regex.Pattern;

public abstract class AbstractLoginHandler implements LoginHandler {

	private static final Pattern EMAIL_PATTERN = Pattern
			.compile("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
					+ "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");

	public AbstractLoginHandler() {

	}

	@Override
	public void login(String username, String password) {

		if (validate(username)) {
			if (checkPassword(username, password)) {
				System.out.println("Logged in as " + username);
			} else {
				System.out.println("Invalid username or password");
			}
		} else {
			System.out.println("Logged in failed !!! ");
		}

	}

	protected boolean checkPassword(String username, String password) {
		return getDatabase().containsKey(username)
				&& getDatabase().get(username).equals(password);
	}

	protected abstract Map<String, String> getDatabase();

	protected boolean validate(String username) {
		return EMAIL_PATTERN.matcher(username).matches();
	}
}
