from datetime import datetime
import dateutil.parser
import matplotlib.pyplot as plt
import json
import uuid
import os

names = {"842d242e512f664b8dc4c939f965ba7d91c2b209699496e7c6cdaabda188f70055d4e018027086": "Social_Context_DNA", 
    "842d24fbd991bc77a99d770cde64b673d343a8aef79468682bd3c7cb599913ca9ddd499a4eb4d0": "Agent_DNA", 
    "842d24544f2cd5c8ef123a7348e44f243bdcc0a5729a2a61f9c3f6a467d03cf5cc714e6164fdd0": "ShortForm_DNA"}

results = json.load(open('./results.json'))
graph_uuid = uuid.uuid4()

if not os.path.isdir("./graphs/{}".format(graph_uuid)):
    os.mkdir("./graphs/{}".format(graph_uuid))

for key, value in results.items():
    name = names[key]
    value["timestamp_series"] = [dateutil.parser.isoparse(timestamp) for timestamp in value["timestamp_series"]]

    # plotting the points
    plt.plot(value["timestamp_series"], value["validation_limbo_series"], label="validation_limbo_series")
    plt.plot(value["timestamp_series"], value["integration_limbo_series"], label="integration_limbo_series")
    plt.plot(value["timestamp_series"], value["integrated_limbo_series"], label="integrated_limbo_series")

    # naming the x axis
    plt.xlabel('x - axis')
    # naming the y axis
    plt.ylabel('y - axis')
    
    # giving a title to my graph
    plt.title('Full limbo state {}'.format(name))
    
    # function to show the plot
    plt.legend(loc='best')
    plt.xticks(rotation=45)
    plt.savefig("./graphs/{}/full_limbo_state_{}.jpg".format(graph_uuid, name))
    plt.clf()

    # plotting the points
    plt.plot(value["timestamp_series"], value["validation_limbo_series"], label="validation_limbo_series")

    # naming the x axis
    plt.xlabel('x - axis')
    # naming the y axis
    plt.ylabel('y - axis')
    
    # giving a title to my graph
    plt.title('Validation limbo {}'.format(name))
    
    # function to show the plot
    plt.legend(loc='best')
    plt.xticks(rotation=45)
    plt.savefig("./graphs/{}/validation_limbo_series_{}.jpg".format(graph_uuid, name))
    plt.clf()

    plt.plot(value["timestamp_series"], value["integration_limbo_series"], label="integration_limbo_series")

    # naming the x axis
    plt.xlabel('x - axis')
    # naming the y axis
    plt.ylabel('y - axis')
    
    # giving a title to my graph
    plt.title('Integration limbo {}'.format(name))
    
    # function to show the plot
    plt.legend(loc='best')
    plt.xticks(rotation=45)
    plt.savefig("./graphs/{}/integration_limbo_series_{}.jpg".format(graph_uuid, name))
    plt.clf()

    plt.plot(value["timestamp_series"], value["integrated_limbo_series"], label="integrated_limbo_series")

    # naming the x axis
    plt.xlabel('x - axis')
    # naming the y axis
    plt.ylabel('y - axis')
    
    # giving a title to my graph
    plt.title('Integrated limbo {}'.format(name))
    
    # function to show the plot
    plt.legend(loc='best')
    plt.xticks(rotation=45)
    plt.savefig("./graphs/{}/integrated_limbo_series_{}.jpg".format(graph_uuid, name))
    plt.clf()

    print ("Graphs have been saved under directory ./graphs/{}".format(graph_uuid))
