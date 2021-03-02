## Walgreens Covid-19 Vaccine Locator

The Walgreens web UI (https://www.walgreens.com/findcare/vaccination/covid-19/location-screening) and API for finding available Covid-19 vaccines is limited to searching a 25-mile radius from a single zip-code. This program leverages the existing API to search a much larger area, such as an entire state.

NOTE: This software is only a draft, and comes with no warranty. Please use at your own risk.

It works by moving the search location through the area using a fairly simple algorithm. If the `*` represents the initial search point, the program searches through adjacent areas as such:

```sh
p o n m l
q d c b k
r e * a j
s f g h i z
t u v w x y
```

If you want to change the starting location of the search, the start date for vaccine availability, or the state(s) you want to search in, for now you'll need to edit the source code.

### Install
```sh
git clone git@github.com:jefftrudeau/walgreens-covid-vaccine-locator.git
cd walgreens-covid-vaccine-locator
npm i
npm start
```

### Sample Output
```sh

> walgreens-covid-vaccine-locator@1.0.0 start
> node index.js


Searched 72 additional points.
Total area searched is approximately:
  top-left: 44.644987063322155, -74.30233906057808
  top-right: 44.644987063322155, -68.60734435092095
  bottom-left: 40.57481154925957, -74.30233906057808
  bottom-right: 40.57481154925957, -68.60734435092095

{
  appointmentsAvailable: true,
  stateName: 'Massachusetts',
  stateCode: 'MA',
  zipCode: '02127',
  radius: 25,
  days: 3
}
```

### TODO
1. Support arguments for initial position, start date, and the list of states to search
1. Provide binaries for major platforms
