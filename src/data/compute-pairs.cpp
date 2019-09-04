////////////////////////////////////////////////////////////////////////////////
// This C++ program pre-computes the "par distance" between each pair of words in the standard dictionary.
// The par number is the length of the shortest path possible between the start and end words using only words in the standard dictionary.
// The Floyd-Warshall algorithm to compute the pars is too slow to be used in real time, or to be implemented in JavaScript at all.
// Therefore, the distances must be pre-computed and loaded with the game.
// This program exports files with the name pairsXX.dat, where XX is the par length.
// The exported files are sequences of short ints (2 bytes), to be read 2 at a time.
// The first short is the index of the start word, as defined by the 0-based line number of the input dictionary text file, and the second is the index of the end word.
// Shorts were used because saving all ~10 million pairs as plain text would multiply the amount of data to be loaded by 4.
// Shorts were the smallest data type usuable for the ~2000 distinct words in the standard dictionary.
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
  ifstream dictionaryFile("standard-dictionary.txt");
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

  cout << "exporting links..." << endl;

  // export links
  string linksFileName = "links.dat";
  ofstream linksFile(linksFileName.c_str(), fstream::binary);
  short endline = -1;
  for(unsigned int i = 0; i < DictionarySize; i++)
  {
    for(unsigned int j = 0; j < Dictionary[i]->links.size(); j++)
    {
      unsigned int index = LookupWordIndex(Dictionary, Dictionary[i]->links[j]);
      linksFile.write(reinterpret_cast<char*>(&index), sizeof(short));
    }
    if (i < DictionarySize)
      linksFile.write(reinterpret_cast<char*>(&endline), sizeof(short));
  }
  linksFile.close();

  cout << "links exported" << endl;

  ////////////////////////////////////////////////////////////////////////////////
  // compute paths
  ////////////////////////////////////////////////////////////////////////////////

  cout << "processing pairs..." << endl;

  // floyd warshall
  unsigned int** Pairs;
  Pairs = new unsigned int*[DictionarySize];
  for (unsigned int i = 0; i < DictionarySize; i++)
    Pairs[i] = new unsigned int[DictionarySize];

  for(unsigned int i = 0; i < DictionarySize; i++)
    for(unsigned int j = 0; j < DictionarySize; j++)
    {
      if (i == j)
        Pairs[i][j] = 0;
      else
        Pairs[i][j] = Infinity;
    }

  for(unsigned int i = 0; i < DictionarySize; i++)
    for(unsigned int j = 0; j < DictionarySize; j++)
      if (i < j)
        if (AreLinked(Dictionary[i], Dictionary[j]))
        {
          Pairs[i][j] = 1;
          Pairs[j][i] = 1;
        }

  unsigned int PairsSize = 0;
  for(unsigned int k = 0; k < DictionarySize; k++) 
  {
    cout << "\r" << Progress(k, DictionarySize, 50);
    for(unsigned int i = 0; i < DictionarySize; i++)
      for(unsigned int j = 0; j < DictionarySize; j++)
        if (Pairs[i][j] > Pairs[i][k] + Pairs[k][j])
        {
          Pairs[i][j] = Pairs[i][k] + Pairs[k][j];
          PairsSize++;
        }
  }

  cout << endl;

  cout << "pairs processed" << endl;

  cout << PairsSize << " pairs" << endl;

  unsigned int LongestPair = 0;
  for(unsigned int i = 0; i < DictionarySize; i++)
    for(unsigned int j = 0; j < DictionarySize; j++)
      if (Pairs[i][j] > LongestPair && Pairs[i][j] != Infinity)
        LongestPair = Pairs[i][j];


  cout << LongestPair << " longest pair" << endl;

  // export pairs
  cout << "exporting pairs..." << endl;

  ofstream pairFiles[LongestPair];
  ostringstream filename;
  for(unsigned int i = 2; i < LongestPair; i++)
  {
    filename.str("");
    filename << "pairs" << i+1 << ".dat";
    pairFiles[i].open(filename.str().c_str(), fstream::binary);
  }

  for(unsigned int i = 0; i < DictionarySize; i++)
    for(unsigned int j = 0; j < DictionarySize; j++)
      if (i < j)
        if (Pairs[i][j] < LongestPair)
        {
          short startIndex = (short)i;
          short endIndex = (short)j;
          pairFiles[Pairs[i][j]].write(reinterpret_cast<char*>(&startIndex), sizeof(short));
          pairFiles[Pairs[i][j]].write(reinterpret_cast<char*>(&endIndex), sizeof(short));
        }

  for(unsigned int i = 0; i < LongestPair; i++)
    pairFiles[i].close();
  for (int i = 0; i < DictionarySize; i++)
  {
    delete Dictionary[i];
    delete[] Pairs[i];
  }
  delete[] Pairs;

  cout << "pairs exported" << endl;

  ////////////////////////////////////////////////////////////////////////////////
  // halt program
  ////////////////////////////////////////////////////////////////////////////////

  cout << endl << endl << "FINISHED" << endl << endl;

  cin.ignore();
  cin.get();

  return 0;
}