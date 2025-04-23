/*
    Pre-computes "par distance" between each pair of words in dictionary of regular/common 4-letter words.
    Par is length of shortest path possible between start and end word, using only words in dictionary.
    Floyd-Warshall algorithm too slow to be used in real time or in JavaScript at all.
    Exports a triangular matrix of pars (1 byte each).
*/

// includes
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <limits>

using namespace std;

// max par value
const unsigned char Infinity = 255;

// word object
struct Word {
    string text;
    vector<Word*> links;
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

    unsigned char diffChars = 0;
    for (unsigned char i = 0; i < wordA.length(); i++) {
        if (wordA[i] != wordB[i])
            diffChars++;
        if (diffChars > 1)
            return false;
    }

    return diffChars == 1;
}

// checks if two words are linked
bool AreLinked(Word* wordA, Word* wordB)
{
    for (unsigned char i = 0; i < wordA->links.size(); i++)
        if (wordA->links[i] == wordB)
            return true;

    for (unsigned char i = 0; i < wordB->links.size(); i++)
        if (wordB->links[i] == wordA)
            return true;

    return false;
}

int main()
{
    cout << "importing dictionary..." << endl;

    vector<Word*> Dictionary;
    vector<Word*>::size_type DictionarySize;
    ifstream dictionaryFile("dictionary.yaml");
    string line;
    while (getline(dictionaryFile, line))
        if (line.find("regular") != string::npos)
            Dictionary.push_back(new Word(line.substr(0, 4)));
    dictionaryFile.close();
    DictionarySize = Dictionary.size();

    if (DictionarySize > 0) {
        cout << "dictionary imported" << endl;
        cout << DictionarySize << " words" << endl;
    }
    else {
        cout << "dictionary not found" << endl;
        return 0;
    }

    cout << "linking words..." << endl;

    for (unsigned short i = 0; i < DictionarySize; i++)
        for (unsigned short j = 0; j < DictionarySize; j++)
            if (i < j)
                if (OneLetterDifferent(Dictionary[i]->text, Dictionary[j]->text)) {
                    Dictionary[i]->links.push_back(Dictionary[j]);
                    Dictionary[j]->links.push_back(Dictionary[i]);
                }

    cout << "words linked" << endl;

    cout << "processing pars..." << endl;

    // floyd warshall
    unsigned char** Pars;
    Pars = new unsigned char*[DictionarySize];
    for (unsigned short i = 0; i < DictionarySize; i++)
        Pars[i] = new unsigned char[DictionarySize];

    for (unsigned short i = 0; i < DictionarySize; i++)
        for (unsigned short j = 0; j < DictionarySize; j++) {
            if (i == j)
                Pars[i][j] = 0;
            else
                Pars[i][j] = Infinity;
        }

    for (unsigned short i = 0; i < DictionarySize; i++)
        for (unsigned short j = 0; j < DictionarySize; j++)
            if (i < j)
                if (AreLinked(Dictionary[i], Dictionary[j])) {
                    Pars[i][j] = 1;
                    Pars[j][i] = 1;
                }

    for (unsigned short k = 0; k < DictionarySize; k++)
        for (unsigned short i = 0; i < DictionarySize; i++)
            for (unsigned short j = 0; j < DictionarySize; j++)
                if (Pars[i][j] > Pars[i][k] + Pars[k][j])
                    Pars[i][j] = Pars[i][k] + Pars[k][j];

    cout << "pars processed" << endl;

    cout << "exporting pars..." << endl;

    ofstream file;
    file.open("pars.dat", fstream::binary);

    for (unsigned short i = 0; i < DictionarySize; i++)
        for (unsigned short j = 0; j < DictionarySize; j++)
            if (i < j)
                file.write(reinterpret_cast<char*>(&Pars[i][j]), sizeof(unsigned char));

    file.close();

    cout << "pars exported" << endl;

    for (int i = 0; i < DictionarySize; i++) {
        delete Dictionary[i];
        delete[] Pars[i];
    }
    delete[] Pars;

    cout << "FINISHED" << endl;

    return 0;
}
