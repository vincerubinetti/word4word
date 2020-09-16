////////////////////////////////////////////////////////////////////////////////
// This C++ program pre-computes the "par distance" between each pair of words in the regular dictionary.
// The par number is the length of the shortest path possible between the start and end words using only words in the regular dictionary.
// The Floyd-Warshall algorithm to compute the pars is too slow to be used in real time, or to be implemented in JavaScript at all.
// Therefore, the distances must be pre-computed and loaded with the game.
// This program exports files with the name parXX.dat, where XX is the par length.
// The exported files are sequences of short ints (2 bytes), to be read 2 at a time.
// The first short is the line number of the start word in the input dictionary text file, and the second is the index of the end word.
// Shorts were used because saving all ~10 million pars as plain text would the size of the data by 4.
// Shorts were the smallest data type usuable for the ~2000 distinct words in the regular dictionary.
////////////////////////////////////////////////////////////////////////////////

// includes
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <ctime>
#include <math.h>
#include <sstream>

using namespace std;

const int Infinity = 999999;

// word object
struct Word
{
  string text;
  vector<Word*> links;
  
  unsigned char explored;
  Word* previous;

  Word(string word)
  {
    text = word;
  }
};

// checks if two words are exactly 1 letter different
bool OneLetterDifferent(string wordA, string wordB)
{
  if (wordA.length() != 4 || wordB.length() != 4)
    return false;

  unsigned int diffChars = 0;
  for(unsigned int i = 0; i < wordA.length(); i++)
  {
    if (wordA[i] != wordB[i])
      diffChars++;
    if (diffChars > 1)
      return false;
  }

  if (diffChars == 1)
    return true;
  else
    return false;
}

// looks up a string word in a set of words
unsigned int LookupWordIndex(vector<Word*> dictionary, Word* word)
{
  for(unsigned int i = 0; i < dictionary.size(); i++)
    if (dictionary[i] == word)
      return i;

  return -1;
}

// checks if two words are linked
bool AreLinked(Word* wordA, Word* wordB)
{
  for(unsigned int i = 0; i < wordA->links.size(); i++)
    if (wordA->links[i] == wordB)
      return true;

  for(unsigned int i = 0; i < wordB->links.size(); i++)
    if (wordB->links[i] == wordA)
      return true;

  return false;
}

// returns string of progress bar
string Progress(unsigned int divisor, unsigned int dividend, unsigned int width)
{
  unsigned int fill = floor(width * (float)divisor / (float)dividend);
  string bar = "";
  for(unsigned int i = 0; i < width; i++)
  {
    if (i <= fill)
      bar.append("|");
    else
      bar.append("-");
  }

  return bar;
}

// main
int main ()
{
  ////////////////////////////////////////////////////////////////////////////////
  // read in dictionary file
  ////////////////////////////////////////////////////////////////////////////////

  cout << "importing dictionary..." << endl;

  vector<Word*> Dictionary;
  vector<Word*>::size_type DictionarySize;
  ifstream dictionaryFile("regular-dictionary.txt");
  string line;
  while (getline(dictionaryFile, line))
    Dictionary.push_back(new Word(line));
  dictionaryFile.close();
  DictionarySize = Dictionary.size();

  if (DictionarySize > 0)
  {
    cout << "dictionary imported" << endl;
    cout << DictionarySize << " words" << endl;
  }
  else
  {
    cout << "dictionary not found" << endl;
    cin.get();
    return 0;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // link together words that are 1 letter different
  ////////////////////////////////////////////////////////////////////////////////

  cout << "linking words..." << endl;

  unsigned int LinksSize = 0;
  for(unsigned int i = 0; i < DictionarySize; i++)
    for(unsigned int j = 0; j < DictionarySize; j++)
      if (i < j)
        if (OneLetterDifferent(Dictionary[i]->text, Dictionary[j]->text))
        {
          Dictionary[i]->links.push_back(Dictionary[j]);
          Dictionary[j]->links.push_back(Dictionary[i]);
          LinksSize++;
        }

  cout << "words linked" << endl;

  cout << LinksSize << " links" << endl;

  ////////////////////////////////////////////////////////////////////////////////
  // compute paths
  ////////////////////////////////////////////////////////////////////////////////

  cout << "processing pars..." << endl;

  // floyd warshall
  unsigned int** Pars;
  Pars = new unsigned int*[DictionarySize];
  for (unsigned int i = 0; i < DictionarySize; i++)
    Pars[i] = new unsigned int[DictionarySize];

  for(unsigned int i = 0; i < DictionarySize; i++)
    for(unsigned int j = 0; j < DictionarySize; j++)
    {
      if (i == j)
        Pars[i][j] = 0;
      else
        Pars[i][j] = Infinity;
    }

  for(unsigned int i = 0; i < DictionarySize; i++)
    for(unsigned int j = 0; j < DictionarySize; j++)
      if (i < j)
        if (AreLinked(Dictionary[i], Dictionary[j]))
        {
          Pars[i][j] = 1;
          Pars[j][i] = 1;
        }

  unsigned int ParsSize = 0;
  for(unsigned int k = 0; k < DictionarySize; k++) 
  {
    cout << "\r" << Progress(k, DictionarySize, 50);
    for(unsigned int i = 0; i < DictionarySize; i++)
      for(unsigned int j = 0; j < DictionarySize; j++)
        if (Pars[i][j] > Pars[i][k] + Pars[k][j])
        {
          Pars[i][j] = Pars[i][k] + Pars[k][j];
          ParsSize++;
        }
  }

  cout << endl;

  cout << "pars processed" << endl;

  cout << ParsSize << " pars" << endl;

  unsigned int LargestPar = 0;
  for(unsigned int i = 0; i < DictionarySize; i++)
    for(unsigned int j = 0; j < DictionarySize; j++)
      if (Pars[i][j] > LargestPar && Pars[i][j] != Infinity)
        LargestPar = Pars[i][j];


  cout << LargestPar << " largest par" << endl;

  // export pars
  cout << "exporting pars..." << endl;

  ofstream parFiles[LargestPar];
  ostringstream filename;
  for(unsigned int i = 2; i < LargestPar; i++)
  {
    filename.str("");
    filename << "par" << i+1 << ".dat";
    parFiles[i].open(filename.str().c_str(), fstream::binary);
  }

  for(unsigned int i = 0; i < DictionarySize; i++)
    for(unsigned int j = 0; j < DictionarySize; j++)
      if (i < j)
        if (Pars[i][j] < LargestPar)
        {
          short startIndex = (short)i;
          short endIndex = (short)j;
          parFiles[Pars[i][j]].write(reinterpret_cast<char*>(&startIndex), sizeof(short));
          parFiles[Pars[i][j]].write(reinterpret_cast<char*>(&endIndex), sizeof(short));
        }

  for(unsigned int i = 0; i < LargestPar; i++)
    parFiles[i].close();
  for (int i = 0; i < DictionarySize; i++)
  {
    delete Dictionary[i];
    delete[] Pars[i];
  }
  delete[] Pars;

  cout << "pars exported" << endl;

  ////////////////////////////////////////////////////////////////////////////////
  // halt program
  ////////////////////////////////////////////////////////////////////////////////

  cout << endl << endl << "FINISHED" << endl << endl;

  cin.ignore();
  cin.get();

  return 0;
}