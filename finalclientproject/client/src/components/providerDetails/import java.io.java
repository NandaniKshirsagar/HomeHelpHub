import java.io.File;  import java.io.FileNotFoundException;  import java.io.PrintWriter; 
 

import java.util.Scanner; import javax.swing.JOptionPane; 
 
 public class practical5{  public static void main(String[] args) {      String firstName, lastName;  double score1, score2, score3, score4, score5;  double average; 
 
try { 
 // Reading from test.txt 
 Scanner inputFile = new Scanner(new File("test.txt")); 
 // Writing to testavg.out 
 PrintWriter outputFile = new PrintWriter("testavg.out"); 
 
 // Read data  firstName = inputFile.next();  lastName = inputFile.next();  score1 = inputFile.nextDouble();  score2 = inputFile.nextDouble();  score3 = inputFile.nextDouble();  score4 = inputFile.nextDouble();  score5 = inputFile.nextDouble(); 

 // Calculate average 

 average = (score1 + score2 + score3 + score4 + score5) / 
5.0; 
 // Output to file  outputFile.printf("%s %s %.2f %.2f %.2f %.2f %.2f Average:%.2f%n",  firstName, lastName,  score1, score2, score3, score4, score5, average); 
 
 // Close files  inputFile.close();  outputFile.close(); 
 JOptionPane.showMessageDialog(null, "Data processedsuccessfully. Check testavg.out file"); 
 System.out.println("Data processed successfully. Checktestavg.out file."); 
 
 } catch (FileNotFoundException e) { 
 System.out.println("Error: " + e.getMessage()); 
 } 
 } 
 } 
