import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.PrintWriter;
import java.io.Writer;
import java.nio.ByteBuffer;
import java.util.Scanner;

import javax.swing.text.WrappedPlainView;

public class XORDecryption {

	public static void main(String[] args) throws Exception {

		try (Scanner s = new Scanner(new File("DecryptMe.txt"))) {
			s.useDelimiter(",");

			int i, j, k, l;

			int numberOfBytesToDecrypt = 40;

			int[] key = new int[3];
			int[] numberOfBytesToRead = new int[numberOfBytesToDecrypt];
			for (i = 0; i < numberOfBytesToDecrypt; ++i) {
				numberOfBytesToRead[i] = s.nextInt();
			}
			Writer writer = new BufferedWriter(new PrintWriter("Decrypted.txt"));
			for (i = 97; i < 123; ++i) {
				key[0] = i;
				for (j = 97; j < 123; ++j) {
					key[1] = j;
					for (k = 97; k < 123; ++k) {
						key[2] = k;
						writer.append("(" + i + "," + j + "," + k + ")");
						for (l = 0; l < numberOfBytesToDecrypt; ++l) {
							writer.append((char) (numberOfBytesToRead[l] ^ key[l % 3]));
						}
						writer.append("\n");
					}
				}
			}
			writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
