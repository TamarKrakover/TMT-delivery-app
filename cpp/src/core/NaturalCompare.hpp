#ifndef NATURAL_COMPARE_HPP
#define NATURAL_COMPARE_HPP

#include <string>
#include <cctype>
using namespace std;
// Comparator to sort strings using natural alphanumeric ordering
struct NaturalCompare {
    bool operator()(const string& a, const string& b) const {
        size_t i = 0, j = 0;
        while (i < a.length() && j < b.length()) {
            if (isdigit(a[i]) && isdigit(b[j])) {
                size_t startA = i, startB = j;
                while (i < a.length() && isdigit(a[i])) i++;
                while (j < b.length() && isdigit(b[j])) j++;
                
                string numA = a.substr(startA, i - startA);
                string numB = b.substr(startB, j - startB);
                
                size_t nonZeroA = 0;
                while (nonZeroA < numA.length() - 1 && numA[nonZeroA] == '0') nonZeroA++;
                numA = numA.substr(nonZeroA);
                
                size_t nonZeroB = 0;
                while (nonZeroB < numB.length() - 1 && numB[nonZeroB] == '0') nonZeroB++;
                numB = numB.substr(nonZeroB);
                
                if (numA.length() != numB.length()) {
                    return numA.length() < numB.length();
                }
                if (numA != numB) {
                    return numA < numB;
                }
            } else {
                if (a[i] != b[j]) {
                    if (isdigit(a[i]) && !isdigit(b[j])) return true;
                    if (!isdigit(a[i]) && isdigit(b[j])) return false;
                    return a[i] < b[j];
                }
                i++;
                j++;
            }
        }
        return a.length() < b.length();
    }
};

#endif