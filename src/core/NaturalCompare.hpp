#ifndef NATURAL_COMPARE_HPP
#define NATURAL_COMPARE_HPP

#include <string>
#include <cctype>

// Comparator to sort strings using natural alphanumeric ordering
struct NaturalCompare {
    bool operator()(const std::string& a, const std::string& b) const {
        size_t i = 0, j = 0;
        while (i < a.length() && j < b.length()) {
            if (std::isdigit(a[i]) && std::isdigit(b[j])) {
                size_t startA = i, startB = j;
                while (i < a.length() && std::isdigit(a[i])) i++;
                while (j < b.length() && std::isdigit(b[j])) j++;
                
                std::string numA = a.substr(startA, i - startA);
                std::string numB = b.substr(startB, j - startB);
                
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
                    if (std::isdigit(a[i]) && !std::isdigit(b[j])) return true;
                    if (!std::isdigit(a[i]) && std::isdigit(b[j])) return false;
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